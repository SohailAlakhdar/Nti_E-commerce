const router = require("express").Router();
const controller = require("../controllers/admin.testimonial.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { testimonialIdParamSchema } = require("../validators/testimonial.validator");

router.use(authenticate, authorizeAdmin);

router.get("/", controller.listAll);
router.patch("/:id/approve", validate(testimonialIdParamSchema), controller.approve);
router.delete("/:id", validate(testimonialIdParamSchema), controller.remove);

module.exports = router;
