const router = require("express").Router();
const controller = require("../controllers/testimonial.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { createTestimonialSchema } = require("../validators/testimonial.validator");

router.get("/", controller.listPublic);
router.post("/", authenticate, validate(createTestimonialSchema), controller.create);

module.exports = router;
