const { PassThrough } = require("stream");
const cloudinary = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const logger = require("../logger/logger");

const FOLDER = "youth-fashion/products";

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });

const uploadProductImage = async (file) => {
  try {
    const result = await uploadBuffer(file.buffer);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    logger.error("Cloudinary upload failed", { error: err.message });
    throw ApiError.internal("Image upload failed", "IMAGE_UPLOAD_FAILED");
  }
};

const uploadManyProductImages = (files) =>
  Promise.all(files.map(uploadProductImage));

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Non-fatal: we don't want a Cloudinary hiccup to block a product
    // delete/update. Log it so it can be cleaned up manually if needed.
    logger.error("Cloudinary delete failed", { publicId, error: err.message });
  }
};

const deleteManyImages = (publicIds) =>
  Promise.all(publicIds.map(deleteImage));

module.exports = { uploadProductImage, uploadManyProductImages, deleteImage, deleteManyImages };
