// Kept as a plain list (not a hard Mongoose enum on the schema) so new
// subcategories can be added without a migration. Validation layer uses
// this list; the schema stores subCategory as a plain uppercase string.
const SUB_CATEGORIES = Object.freeze([
  "T_SHIRT",
  "PANTS",
  "SHIRT",
  "JEANS",
  "HOODIE",
  "JACKET",
  "DRESS",
  "SKIRT",
]);

module.exports = SUB_CATEGORIES;
