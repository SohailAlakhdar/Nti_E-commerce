const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/addresses", require("./address.routes"));
router.use("/products", require("./product.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
router.use("/admin/orders", require("./admin.order.routes"));
router.use("/shipping", require("./shipping.routes"));
router.use("/policies", require("./policy.routes"));
router.use("/about", require("./about.routes"));
router.use("/testimonials", require("./testimonial.routes"));
router.use("/admin/testimonials", require("./admin.testimonial.routes"));
router.use("/home", require("./home.routes"));
router.use("/admin/reports", require("./report.routes"));

module.exports = router;
