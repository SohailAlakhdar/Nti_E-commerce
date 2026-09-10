const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const shippingService = require("../services/shipping.service");

const getPolicy = asyncHandler(async (req, res) => {
  const policy = await shippingService.getActivePolicy();
  res.json(new ApiResponse("Shipping policy fetched", { policy }));
});

const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await shippingService.updatePolicy(req.body, req.user._id);
  res.json(new ApiResponse("Shipping policy updated", { policy }));
});

module.exports = { getPolicy, updatePolicy };
