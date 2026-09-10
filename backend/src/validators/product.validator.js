const { z } = require("zod");
const GENDER = require("../enums/gender.enum");
const SUB_CATEGORIES = require("../enums/subCategory.enum");

const listProductsSchema = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    gender: z.enum(Object.values(GENDER)).optional(),
    subCategory: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    isActive: z.string().optional(),
  }),
});

const createProductSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().min(1),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().min(0),
    gender: z.enum(Object.values(GENDER)),
    subCategory: z
      .string()
      .transform((v) => v.toUpperCase())
      .refine((v) => SUB_CATEGORIES.includes(v), { message: "Unknown subCategory" }),
  }),
});

const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.any().optional(),
  body: z.object({
    name: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().min(1).optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    gender: z.enum(Object.values(GENDER)).optional(),
    subCategory: z
      .string()
      .transform((v) => v.toUpperCase())
      .refine((v) => SUB_CATEGORIES.includes(v), { message: "Unknown subCategory" })
      .optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

const slugParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ slug: z.string().min(1) }),
});

module.exports = {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  slugParamSchema,
};
