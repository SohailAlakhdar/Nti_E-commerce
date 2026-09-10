const router = require("express").Router();
const controller = require("../controllers/policy.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { policyUpsertSchema } = require("../validators/content.validator");

router.get("/", controller.list);
router.get("/:slug", controller.getBySlug);
router.post("/", authenticate, authorizeAdmin, validate(policyUpsertSchema), controller.upsert);

module.exports = router;
