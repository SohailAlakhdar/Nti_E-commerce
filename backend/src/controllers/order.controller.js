const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const orderService = require("../services/order.service");
const { cartOwnerFromReq } = require("../middlewares/guestCart.middleware");

const createOrder = asyncHandler(async (req, res) => {
  const { userId, sessionId } = cartOwnerFromReq(req);
  const customerName = req.body.customerName || (req.user ? req.user.name : undefined);
  const customerPhone = req.body.customerPhone || (req.user ? req.user.phone : undefined);

  const order = await orderService.createOrderFromCart({
    userId,
    sessionId,
    addressId: req.body.addressId,
    customerName,
    customerPhone,
  });

  res.status(201).json(new ApiResponse("Order created successfully", { order }));
});

const listMyOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await orderService.listOrdersForUser(req.user._id, req.query);
  res.json(new ApiResponse("Orders fetched", { orders: items, meta }));
});

const getMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderForUser(req.user._id, req.params.id);
  res.json(new ApiResponse("Order fetched", { order }));
});

module.exports = { createOrder, listMyOrders, getMyOrder };
