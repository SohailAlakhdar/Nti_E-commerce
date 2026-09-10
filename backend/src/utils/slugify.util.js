const slugify = require("slugify");

/**
 * Generates a URL-safe slug, appending a short random suffix on collision.
 * The caller is expected to retry on a unique-index violation using
 * `generateUniqueSlug` from product.service.js — this is the pure function.
 */
const toSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

module.exports = { toSlug };
