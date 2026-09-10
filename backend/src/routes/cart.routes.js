const router = require("express").Router();
const controller = require("../controllers/cart.controller");
const validate = require("../middlewares/validate.middleware");
const { optionalAuthenticate } = require("../middlewares/auth.middleware");
const { ensureGuestSession } = require("../middlewares/guestCart.middleware");
const {
  addItemSchema,
  updateItemSchema,
  itemIdParamSchema,
} = require("../validators/cart.validator");

// Every cart route works for guests and logged-in users alike (Rule 1/2).
router.use(optionalAuthenticate, ensureGuestSession);

router.get("/", controller.getCart);
router.post("/items", validate(addItemSchema), controller.addItem);
router.patch("/items/:itemId", validate(updateItemSchema), controller.updateItem);
router.delete("/items/:itemId", validate(itemIdParamSchema), controller.removeItem);
router.delete("/", controller.clearCart);

module.exports = router;
