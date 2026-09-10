const router = require("express").Router();
const controller = require("../controllers/address.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  createAddressSchema,
  updateAddressSchema,
  idParamSchema,
} = require("../validators/address.validator");

router.use(authenticate); // every address route requires a logged-in user

router.get("/", controller.list);
router.get("/:id", validate(idParamSchema), controller.getOne);
router.post("/", validate(createAddressSchema), controller.create);
router.patch("/:id", validate(updateAddressSchema), controller.update);
router.delete("/:id", validate(idParamSchema), controller.remove);

module.exports = router;
