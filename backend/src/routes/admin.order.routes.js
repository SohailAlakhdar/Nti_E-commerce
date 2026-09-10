const router = require("express").Router();
const controller = require("../controllers/admin.order.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { changeStatusSchema, orderIdParamSchema } = require("../validators/order.validator");

router.use(authenticate, authorizeAdmin);

router.get("/", controller.listAll);
router.get("/:id", validate(orderIdParamSchema), controller.getOne);
router.patch("/:id/status", validate(changeStatusSchema), controller.changeStatus);

module.exports = router;
