const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const orderService = require("../services/order.service");
const logger = require("../logger/logger");

const listAll = asyncHandler(async (req, res) => {
  const { items, meta } = await orderService.listOrdersForAdmin(req.query);
  res.json(new ApiResponse("Orders fetched", { orders: items, meta }));
});

const getOne = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderForAdmin(req.params.id);
  res.json(new ApiResponse("Order fetched", { order }));
});

const changeStatus = asyncHandler(async (req, res) => {
  const order = await orderService.changeOrderStatus(req.params.id, req.body.status, req.user._id);
  logger.info("Admin changed order status", {
    orderId: order._id,
    newStatus: order.status,
    adminId: req.user._id,
  });
  res.json(new ApiResponse("Order status updated", { order }));
});

module.exports = { listAll, getOne, changeStatus };
