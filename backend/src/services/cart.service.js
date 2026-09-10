const crypto = require("crypto");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");

const SESSION_COOKIE = "guest_cart_sid";

const generateSessionId = () => crypto.randomBytes(24).toString("hex");

/**
 * Resolves (and creates if needed) the cart for the current request.
 * Authenticated requests key on userId; guests key on a signed-ish random
 * sessionId stored in an httpOnly cookie (set by the controller).
 */
const getOrCreateCart = async ({ userId, sessionId }) => {
  const filter = userId ? { user: userId } : { sessionId };
  let cart = await Cart.findOne(filter).populate("items.product");
  if (!cart) {
    cart = await Cart.create(userId ? { user: userId } : { sessionId });
    cart = await cart.populate("items.product");
  }
  return cart;
};

const assertPurchasable = (product, requestedQty) => {
  if (!product || !product.isActive) {
    throw ApiError.badRequest("Product is not available", "PRODUCT_UNAVAILABLE");
  }
  if (product.stock <= 0) {
    throw ApiError.badRequest("Product is out of stock", "PRODUCT_OUT_OF_STOCK");
  }
  if (requestedQty > product.stock) {
    throw ApiError.badRequest(
      `Only ${product.stock} unit(s) left in stock`,
      "INSUFFICIENT_STOCK"
    );
  }
};

const addItem = async (cartOwner, { productId, quantity }) => {
  const product = await Product.findById(productId);
  assertPurchasable(product, quantity);

  const cart = await getOrCreateCart(cartOwner);
  const existing = cart.items.find((i) => i.product._id.toString() === productId);

  const newQty = existing ? existing.quantity + quantity : quantity;
  if (newQty > product.stock) {
    throw ApiError.badRequest(
      `Only ${product.stock} unit(s) left in stock`,
      "INSUFFICIENT_STOCK"
    );
  }

  if (existing) {
    existing.quantity = newQty;
    existing.price = product.price; // refresh snapshot to current price
  } else {
    cart.items.push({ product: product._id, quantity, price: product.price });
  }

  await cart.save();
  return cart.populate("items.product");
};

const updateItemQuantity = async (cartOwner, itemId, quantity) => {
  const cart = await getOrCreateCart(cartOwner);
  const item = cart.items.id(itemId);
  if (!item) throw ApiError.notFound("Cart item not found", "CART_ITEM_NOT_FOUND");

  const product = await Product.findById(item.product._id || item.product);
  assertPurchasable(product, quantity);

  item.quantity = quantity;
  item.price = product.price;
  await cart.save();
  return cart.populate("items.product");
};

const removeItem = async (cartOwner, itemId) => {
  const cart = await getOrCreateCart(cartOwner);
  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.save();
  return cart.populate("items.product");
};

const clearCart = async (cartOwner) => {
  const cart = await getOrCreateCart(cartOwner);
  cart.items = [];
  await cart.save();
  return cart;
};

/**
 * Merges a guest cart into the authenticated user's cart on login
 * (Section 11). Quantities for the same product are combined but capped
 * at live stock so we never let a merge create an over-sold cart line.
 * The guest cart document is deleted once merged.
 */
const mergeGuestCartIntoUser = async ({ sessionId, userId }) => {
  if (!sessionId) return;

  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) await guestCart.deleteOne();
    return;
  }

  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    userCart = await Cart.create({ user: userId });
  }

  for (const guestItem of guestCart.items) {
    const product = await Product.findById(guestItem.product);
    if (!product || !product.isActive) continue;

    const existing = userCart.items.find(
      (i) => i.product.toString() === guestItem.product.toString()
    );
    const combinedQty = (existing ? existing.quantity : 0) + guestItem.quantity;
    const cappedQty = Math.min(combinedQty, product.stock);

    if (cappedQty <= 0) continue;

    if (existing) {
      existing.quantity = cappedQty;
      existing.price = product.price;
    } else {
      userCart.items.push({ product: product._id, quantity: cappedQty, price: product.price });
    }
  }

  await userCart.save();
  await guestCart.deleteOne();
};

module.exports = {
  SESSION_COOKIE,
  generateSessionId,
  getOrCreateCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  mergeGuestCartIntoUser,
  assertPurchasable,
};
