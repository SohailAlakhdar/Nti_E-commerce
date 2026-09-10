const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(ApiError.badRequest("Only image files are allowed", "INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});

// Product images: field name "images", up to 6 files.
const uploadProductImages = upload.array("images", 6);

module.exports = { uploadProductImages };
