const router = require("express").Router();
const controller = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, optionalAuthenticate } = require("../middlewares/auth.middleware");
const { ensureGuestSession } = require("../middlewares/guestCart.middleware");
const { createOrderSchema, orderIdParamSchema } = require("../validators/order.validator");

// Checkout must work for guests too (Rule 3), so we use optional auth here
// specifically for order creation.
router.post(
  "/",
  optionalAuthenticate,
  ensureGuestSession,
  validate(createOrderSchema),
  controller.createOrder
);

// Viewing order history requires an account.
router.get("/", authenticate, controller.listMyOrders);
router.get("/:id", authenticate, validate(orderIdParamSchema), controller.getMyOrder);

module.exports = router;
