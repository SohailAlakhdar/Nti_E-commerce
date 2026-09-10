const router = require("express").Router();
const controller = require("../controllers/home.controller");

router.get("/new-arrivals", controller.newArrivals);
router.get("/top-sales", controller.topSales);

module.exports = router;
