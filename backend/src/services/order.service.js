const mongoose = require("mongoose");
const Order = require("../models/order.model");
const OrderStatusHistory = require("../models/orderStatusHistory.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Address = require("../models/address.model");
const ApiError = require("../utils/ApiError");
const logger = require("../logger/logger");
const generateOrderNumber = require("../utils/generateOrderNumber");
const { ORDER_STATUS, VALID_STATUS_VALUES } = require("../enums/orderStatus.enum");
const { getActivePolicy: getActiveShipping } = require("./shipping.service");
const { parsePagination, buildMeta } = require("../utils/pagination");

/**
 * Atomically decrements stock for a single product inside a session. The
 * filter's `stock: { $gte: quantity }` makes this safe under concurrency:
 * if two requests race for the last unit, only one findOneAndUpdate call
 * can match, and the other sees stock unchanged and fails cleanly
 * (Section 13). This is strictly stronger than a read-then-write check.
 */
const atomicDecrementStock = async (productId, quantity, session) => {
  const updated = await Product.findOneAndUpdate(
    { _id: productId, isActive: true, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true, session }
  );
  return updated; // null means insufficient stock or product inactive
};

/**
 * Full checkout flow per Section 17. Runs inside a MongoDB transaction so
 * that "create order" + "decrement stock (N times)" + "clear cart" either
 * all succeed or all roll back — there's no window where stock is
 * decremented but the order failed to persist, or vice versa.
 */
const createOrderFromCart = async ({ userId, sessionId, addressId, customerName, customerPhone }) => {
  const cartFilter = userId ? { user: userId } : { sessionId };
  const cart = await Cart.findOne(cartFilter).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest("Your cart is empty", "CART_EMPTY");
  }

  const address = await Address.findOne(
    userId ? { _id: addressId, user: userId } : { _id: addressId }
  );
  if (!address) {
    throw ApiError.badRequest("Delivery address not found", "ADDRESS_NOT_FOUND");
  }

  const shippingPolicy = await getActiveShipping();
  const shippingCost = shippingPolicy ? shippingPolicy.shippingCost : 0;

  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotal = 0;

      for (const cartItem of cart.items) {
        // Re-read is implicit via atomicDecrementStock's findOneAndUpdate,
        // which is itself the authoritative, race-safe stock+active check.
        // We never trust cart.items[].price or the product doc fetched
        // earlier via populate() for money math — only the freshly
        // returned document from the atomic update below.
        const updatedProduct = await atomicDecrementStock(
          cartItem.product._id,
          cartItem.quantity,
          session
        );

        if (!updatedProduct) {
          // Could be inactive OR insufficient stock — re-fetch to give a
          // precise error message without affecting the atomic guarantee.
          const current = await Product.findById(cartItem.product._id).session(session);
          if (!current || !current.isActive) {
            throw ApiError.badRequest(
              `"${cartItem.product.name}" is no longer available`,
              "PRODUCT_INACTIVE"
            );
          }
          throw ApiError.badRequest(
            `Insufficient stock for "${cartItem.product.name}" (only ${current.stock} left)`,
            "INSUFFICIENT_STOCK"
          );
        }

        // The price used for the order snapshot comes from the product
        // document at the moment of the atomic update, not the client or
        // the cart's stale cached price (Section 10/14).
        const lineTotal = updatedProduct.price * cartItem.quantity;
        subtotal += lineTotal;

        orderItems.push({
          productId: updatedProduct._id,
          name: updatedProduct.name,
          price: updatedProduct.price,
          quantity: cartItem.quantity,
          total: lineTotal,
        });
      }

      const totalPrice = subtotal + shippingCost;

      const [createdOrder] = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            customer: { userId: userId || null, name: customerName, phone: customerPhone },
            items: orderItems,
            address: {
              fullName: address.fullName,
              phone: address.phone,
              city: address.city,
              area: address.area,
              street: address.street,
              building: address.building,
              floor: address.floor,
              apartment: address.apartment,
              notes: address.notes,
            },
            subtotal,
            shippingCost,
            totalPrice,
            status: ORDER_STATUS.PENDING,
          },
        ],
        { session }
      );

      cart.items = [];
      await cart.save({ session });

      order = createdOrder;
    });
  } catch (err) {
    logger.error("Order creation failed", { error: err.message, userId, sessionId });
    throw err;
  } finally {
    await session.endSession();
  }

  return order;
};

const listOrdersForUser = async (userId, queryParams) => {
  const { page, limit, skip } = parsePagination(queryParams);
  const filter = { "customer.userId": userId };
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ orderedAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
};

const getOrderForUser = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, "customer.userId": userId });
  if (!order) throw ApiError.notFound("Order not found", "ORDER_NOT_FOUND");
  return order;
};

const listOrdersForAdmin = async (queryParams) => {
  const { page, limit, skip } = parsePagination(queryParams);
  const filter = {};
  if (queryParams.status !== undefined) filter.status = Number(queryParams.status);

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ orderedAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
};

const getOrderForAdmin = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found", "ORDER_NOT_FOUND");
  return order;
};

/**
 * Admin can move an order to any status from any status (Section 15/Rule
 * 13). Every change is recorded in OrderStatusHistory in the same
 * transaction as the update (Section 16/Rule 14), and setting CANCELLED
 * stamps cancelledAt.
 */
const changeOrderStatus = async (orderId, newStatus, adminUserId) => {
  if (!VALID_STATUS_VALUES.includes(newStatus)) {
    throw ApiError.badRequest("Invalid order status", "INVALID_STATUS");
  }

  const session = await mongoose.startSession();
  let updatedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw ApiError.notFound("Order not found", "ORDER_NOT_FOUND");

      const oldStatus = order.status;

      order.status = newStatus;
      if (newStatus === ORDER_STATUS.CANCELLED) {
        order.cancelledAt = new Date();
      }
      await order.save({ session });

      await OrderStatusHistory.create(
        [{ order: order._id, oldStatus, newStatus, changedBy: adminUserId, changedAt: new Date() }],
        { session }
      );

      updatedOrder = order;
    });
  } finally {
    await session.endSession();
  }

  return updatedOrder;
};

module.exports = {
  createOrderFromCart,
  listOrdersForUser,
  getOrderForUser,
  listOrdersForAdmin,
  getOrderForAdmin,
  changeOrderStatus,
};
