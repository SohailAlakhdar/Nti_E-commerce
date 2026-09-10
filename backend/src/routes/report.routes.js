const router = require("express").Router();
const controller = require("../controllers/report.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

router.use(authenticate, authorizeAdmin);

router.get("/overview", controller.overview);
router.get("/sales", controller.sales);
router.get("/top-products", controller.topProducts);
router.get("/categories", controller.categories);

module.exports = router;
