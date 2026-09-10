const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const reportService = require("../services/report.service");

const overview = asyncHandler(async (req, res) => {
  const data = await reportService.getOverview();
  res.json(new ApiResponse("Report overview fetched", data));
});

const sales = asyncHandler(async (req, res) => {
  const [byDay, byMonth] = await Promise.all([
    reportService.getSalesByDay(req.query),
    reportService.getSalesByMonth(),
  ]);
  res.json(new ApiResponse("Sales report fetched", { byDay, byMonth }));
});

const topProducts = asyncHandler(async (req, res) => {
  const products = await reportService.getTopSellingProducts();
  res.json(new ApiResponse("Top products fetched", { products }));
});

const categories = asyncHandler(async (req, res) => {
  const data = await reportService.getSalesByCategory();
  res.json(new ApiResponse("Sales by category fetched", { categories: data }));
});

module.exports = { overview, sales, topProducts, categories };
