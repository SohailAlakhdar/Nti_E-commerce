const router = require("express").Router();
const controller = require("../controllers/shipping.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { shippingUpdateSchema } = require("../validators/content.validator");

router.get("/", controller.getPolicy); // public — needed for cart/checkout UI
router.patch("/", authenticate, authorizeAdmin, validate(shippingUpdateSchema), controller.updatePolicy);

module.exports = router;
