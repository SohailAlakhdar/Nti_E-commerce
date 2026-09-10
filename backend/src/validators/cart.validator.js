const { z } = require("zod");

const addItemSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(999),
  }),
});

const updateItemSchema = z.object({
  params: z.object({ itemId: z.string().min(1) }),
  query: z.any().optional(),
  body: z.object({
    quantity: z.coerce.number().int().min(1).max(999),
  }),
});

const itemIdParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ itemId: z.string().min(1) }),
});

module.exports = { addItemSchema, updateItemSchema, itemIdParamSchema };
