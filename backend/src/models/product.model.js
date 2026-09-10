const mongoose = require("mongoose");
const GENDER = require("../enums/gender.enum");

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [productImageSchema], default: [] },
    gender: { type: String, enum: Object.values(GENDER), required: true, index: true },
    subCategory: { type: String, required: true, uppercase: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    freezedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

productSchema.virtual("isOutOfStock").get(function isOutOfStock() {
  return this.stock <= 0;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
