const { z } = require("zod");

const createTestimonialSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    message: z.string().trim().min(3).max(1000),
  }),
});

const testimonialIdParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createTestimonialSchema, testimonialIdParamSchema };
