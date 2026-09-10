const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const aboutService = require("../services/about.service");

const getAbout = asyncHandler(async (req, res) => {
  const about = await aboutService.getAboutPage();
  res.json(new ApiResponse("About page fetched", { about }));
});

const updateAbout = asyncHandler(async (req, res) => {
  const about = await aboutService.updateAboutPage(req.body, req.user._id);
  res.json(new ApiResponse("About page updated", { about }));
});

module.exports = { getAbout, updateAbout };
