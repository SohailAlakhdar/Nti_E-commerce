const { z } = require("zod");

const addressBody = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(1),
  area: z.string().trim().min(1),
  street: z.string().trim().min(1),
  building: z.string().trim().optional(),
  floor: z.string().trim().optional(),
  apartment: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
});

const createAddressSchema = z.object({
  body: addressBody,
  query: z.any().optional(),
  params: z.any().optional(),
});

const updateAddressSchema = z.object({
  body: addressBody.partial(),
  query: z.any().optional(),
  params: z.object({ id: z.string().min(1) }),
});

const idParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createAddressSchema, updateAddressSchema, idParamSchema };
