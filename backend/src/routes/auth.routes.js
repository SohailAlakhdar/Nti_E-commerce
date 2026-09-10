const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { authenticate } = require("../middlewares/auth.middleware");
const { authRateLimiter } = require("../middlewares/rateLimiter.middleware");

router.post("/register", authRateLimiter, validate(registerSchema), controller.register);
router.post("/login", authRateLimiter, validate(loginSchema), controller.login);
router.post("/refresh", authRateLimiter, controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

module.exports = router;
