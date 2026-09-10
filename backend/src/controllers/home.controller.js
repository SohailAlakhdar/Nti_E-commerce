const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const homeService = require("../services/home.service");

const newArrivals = asyncHandler(async (req, res) => {
  const products = await homeService.getNewArrivals();
  res.json(new ApiResponse("New arrivals fetched", { products }));
});

const topSales = asyncHandler(async (req, res) => {
  const products = await homeService.getTopSales();
  res.json(new ApiResponse("Top sales fetched", { products }));
});

module.exports = { newArrivals, topSales };
