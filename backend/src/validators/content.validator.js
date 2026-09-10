const { z } = require("zod");

const shippingUpdateSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    title: z.string().trim().optional(),
    content: z.string().optional(),
    shippingCost: z.coerce.number().min(0).optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

const policyUpsertSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    slug: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1),
    content: z.string(),
  }),
});

const aboutUpdateSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    title: z.string().trim().optional(),
    content: z.string().optional(),
  }),
});

module.exports = { shippingUpdateSchema, policyUpsertSchema, aboutUpdateSchema };
