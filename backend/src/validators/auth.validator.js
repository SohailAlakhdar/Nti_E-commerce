const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7).max(20),
    password: z.string().min(8).max(128),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

module.exports = { registerSchema, loginSchema };
