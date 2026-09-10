const Testimonial = require("../models/testimonial.model");
const ApiError = require("../utils/ApiError");
const { cache, CACHE_KEYS } = require("../cache/nodeCache");
const { parsePagination, buildMeta } = require("../utils/pagination");

const listPublicApproved = async () => {
  const cached = cache.get(CACHE_KEYS.TESTIMONIALS_PUBLIC);
  if (cached) return cached;

  const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
  cache.set(CACHE_KEYS.TESTIMONIALS_PUBLIC, testimonials);
  return testimonials;
};

const submitTestimonial = async (user, message) => {
  // isApproved always defaults to false regardless of client input
  // (Section 22, Rule 7) — never accept an isApproved field from the body.
  const testimonial = await Testimonial.create({
    user: user._id,
    name: user.name,
    message,
    isApproved: false,
  });
  return testimonial;
};

const listAllForAdmin = async (queryParams) => {
  const { page, limit, skip } = parsePagination(queryParams);
  const filter = {};
  if (queryParams.isApproved !== undefined) {
    filter.isApproved = queryParams.isApproved === "true";
  }
  const [items, total] = await Promise.all([
    Testimonial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Testimonial.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
};

const approve = async (id) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!testimonial) throw ApiError.notFound("Testimonial not found", "TESTIMONIAL_NOT_FOUND");
  cache.del(CACHE_KEYS.TESTIMONIALS_PUBLIC);
  return testimonial;
};

const remove = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw ApiError.notFound("Testimonial not found", "TESTIMONIAL_NOT_FOUND");
  cache.del(CACHE_KEYS.TESTIMONIALS_PUBLIC);
};

module.exports = { listPublicApproved, submitTestimonial, listAllForAdmin, approve, remove };
