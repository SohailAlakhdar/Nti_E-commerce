const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const testimonialService = require("../services/testimonial.service");

const listPublic = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.listPublicApproved();
  res.json(new ApiResponse("Testimonials fetched", { testimonials }));
});

const create = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.submitTestimonial(req.user, req.body.message);
  res
    .status(201)
    .json(new ApiResponse("Thanks for your feedback! It will appear after review.", { testimonial }));
});

module.exports = { listPublic, create };
