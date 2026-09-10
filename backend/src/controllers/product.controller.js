const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const productService = require("../services/product.service");
const cloudinaryService = require("../services/cloudinary.service");

const list = asyncHandler(async (req, res) => {
  const { items, meta } = await productService.listProducts(req.query);
  res.json(new ApiResponse("Products fetched", { products: items, meta }));
});

const getBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getBySlug(req.params.slug);
  res.json(new ApiResponse("Product fetched", { product }));
});

const create = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const images = files.length ? await cloudinaryService.uploadManyProductImages(files) : [];
  const product = await productService.createProduct(req.body, images);
  res.status(201).json(new ApiResponse("Product created", { product }));
});

const update = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const newImages = files.length ? await cloudinaryService.uploadManyProductImages(files) : [];
  const product = await productService.updateProduct(req.params.id, req.body, newImages);
  res.json(new ApiResponse("Product updated", { product }));
});

const remove = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  res.json(new ApiResponse("Product deactivated", { product }));
});

const removeImage = asyncHandler(async (req, res) => {
  // publicId comes from the body, not a URL path param, since Cloudinary
  // public IDs contain slashes (e.g. "youth-fashion/products/abc123").
  const product = await productService.removeProductImage(req.params.id, req.body.publicId);
  res.json(new ApiResponse("Image removed", { product }));
});

module.exports = { list, getBySlug, create, update, remove, removeImage };
