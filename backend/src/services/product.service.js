const Product = require("../models/product.model");
const ApiError = require("../utils/ApiError");
const { toSlug } = require("../utils/slugify.util");
const { parsePagination, buildMeta } = require("../utils/pagination");
const { cache, CACHE_KEYS, invalidateByPrefix } = require("../cache/nodeCache");
const { deleteManyImages } = require("./cloudinary.service");

/**
 * Generates a unique slug by appending -2, -3, ... on collision, so admins
 * can create "Oversized Black T-Shirt" twice without a raw duplicate-key
 * crash (Section 32).
 */
const generateUniqueSlug = async (name) => {
  const base = toSlug(name);
  let slug = base;
  let suffix = 2;
  // Bounded loop — a product catalog with hundreds of same-name collisions
  // is not a realistic case, but we avoid an infinite loop regardless.
  while (await Product.exists({ slug }) && suffix < 1000) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

const buildFilterQuery = ({ gender, subCategory, minPrice, maxPrice, search, isActive }) => {
  const query = {};
  if (gender) query.gender = gender;
  if (subCategory) query.subCategory = subCategory;
  if (isActive !== undefined) query.isActive = isActive === "true" || isActive === true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };
  return query;
};

const listProducts = async (queryParams) => {
  const { page, limit, skip } = parsePagination(queryParams);
  const cacheKey = `${CACHE_KEYS.PRODUCT_LIST}:${JSON.stringify({ ...queryParams, page, limit })}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const filter = buildFilterQuery(queryParams);
  // Public product listing should default to active-only unless an admin
  // explicitly asks for inactive ones via isActive=false.
  if (queryParams.isActive === undefined) filter.isActive = true;

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  const result = { items, meta: buildMeta({ page, limit, total }) };
  cache.set(cacheKey, result);
  return result;
};

const getBySlug = async (slug) => {
  const cacheKey = CACHE_KEYS.PRODUCT_DETAIL(slug);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const product = await Product.findOne({ slug, isActive: true });
  if (!product) throw ApiError.notFound("Product not found", "PRODUCT_NOT_FOUND");

  cache.set(cacheKey, product);
  return product;
};

// Admin-only lookup by id — bypasses the isActive/public filter so admins
// can manage frozen/inactive products too.
const getByIdForAdmin = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound("Product not found", "PRODUCT_NOT_FOUND");
  return product;
};

const invalidateProductCaches = () => {
  invalidateByPrefix(CACHE_KEYS.PRODUCT_LIST);
  invalidateByPrefix("products:detail:");
  invalidateByPrefix(CACHE_KEYS.NEW_ARRIVALS);
  invalidateByPrefix(CACHE_KEYS.TOP_SALES);
};

const createProduct = async (payload, images = []) => {
  const slug = await generateUniqueSlug(payload.name);
  const product = await Product.create({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    gender: payload.gender,
    subCategory: payload.subCategory,
    slug,
    images,
  });
  invalidateProductCaches();
  return product;
};

const updateProduct = async (id, payload, newImages = []) => {
  const product = await getByIdForAdmin(id);

  // Explicit whitelist — never spread req.body directly into the document,
  // so a client can't smuggle in stock/price changes through unexpected
  // keys or override immutable fields like slug history.
  const allowedFields = ["name", "description", "price", "stock", "gender", "subCategory", "isActive"];
  for (const field of allowedFields) {
    if (payload[field] !== undefined) product[field] = payload[field];
  }

  if (payload.name && payload.name !== product.name) {
    product.slug = await generateUniqueSlug(payload.name);
  }

  if (payload.isActive === false && !product.freezedAt) {
    product.freezedAt = new Date();
  } else if (payload.isActive === true) {
    product.freezedAt = null;
  }

  if (newImages.length) {
    product.images.push(...newImages);
  }

  await product.save();
  invalidateProductCaches();
  return product;
};

const deleteProduct = async (id) => {
  const product = await getByIdForAdmin(id);

  // Soft-delete philosophy (Section 33): freeze instead of destroying, so
  // historical orders referencing this product stay meaningful. A hard
  // delete is only appropriate for a product that was never ordered; we
  // still just freeze here to keep the rule simple and safe by default.
  product.isActive = false;
  product.freezedAt = new Date();
  await product.save();

  invalidateProductCaches();
  return product;
};

const removeProductImage = async (productId, publicId) => {
  const product = await getByIdForAdmin(productId);
  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();
  await deleteManyImages([publicId]);
  invalidateProductCaches();
  return product;
};

module.exports = {
  listProducts,
  getBySlug,
  getByIdForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
  invalidateProductCaches,
};
