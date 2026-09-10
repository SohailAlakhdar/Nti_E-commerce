const router = require("express").Router();
const controller = require("../controllers/about.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { aboutUpdateSchema } = require("../validators/content.validator");

router.get("/", controller.getAbout);
router.patch("/", authenticate, authorizeAdmin, validate(aboutUpdateSchema), controller.updateAbout);

module.exports = router;
