const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const testimonialService = require("../services/testimonial.service");

const listAll = asyncHandler(async (req, res) => {
  const { items, meta } = await testimonialService.listAllForAdmin(req.query);
  res.json(new ApiResponse("Testimonials fetched", { testimonials: items, meta }));
});

const approve = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.approve(req.params.id);
  res.json(new ApiResponse("Testimonial approved", { testimonial }));
});

const remove = asyncHandler(async (req, res) => {
  await testimonialService.remove(req.params.id);
  res.json(new ApiResponse("Testimonial deleted"));
});

module.exports = { listAll, approve, remove };
