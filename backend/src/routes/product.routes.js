const router = require("express").Router();
const controller = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const { uploadProductImages } = require("../middlewares/upload.middleware");
const {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  slugParamSchema,
} = require("../validators/product.validator");
const { idParamSchema } = require("../validators/address.validator");

// Public
router.get("/", validate(listProductsSchema), controller.list);
router.get("/:slug", validate(slugParamSchema), controller.getBySlug);

// Admin only
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  uploadProductImages,
  validate(createProductSchema),
  controller.create
);
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  uploadProductImages,
  validate(updateProductSchema),
  controller.update
);
router.delete("/:id", authenticate, authorizeAdmin, validate(idParamSchema), controller.remove);
router.delete(
  "/:id/images",
  authenticate,
  authorizeAdmin,
  validate(idParamSchema),
  controller.removeImage
);

module.exports = router;
