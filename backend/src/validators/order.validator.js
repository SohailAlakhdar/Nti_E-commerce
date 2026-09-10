const { z } = require("zod");
const { VALID_STATUS_VALUES } = require("../enums/orderStatus.enum");

const createOrderSchema = z.object({
  params: z.any().optional(),
  query: z.any().optional(),
  body: z.object({
    addressId: z.string().min(1),
    // Required for guest checkout since there's no account name/phone yet.
    // For authenticated users these are optional and fall back to the
    // user's profile in the controller.
    customerName: z.string().trim().min(2).max(80).optional(),
    customerPhone: z.string().trim().min(7).max(20).optional(),
  }),
});

const changeStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.any().optional(),
  body: z.object({
    status: z.coerce.number().refine((v) => VALID_STATUS_VALUES.includes(v), {
      message: "Invalid order status",
    }),
  }),
});

const orderIdParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createOrderSchema, changeStatusSchema, orderIdParamSchema };
