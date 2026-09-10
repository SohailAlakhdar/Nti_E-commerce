const mongoose = require("mongoose");

const shippingPolicySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Shipping Policy" },
    content: { type: String, required: true, default: "" },
    shippingCost: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingPolicy", shippingPolicySchema);
