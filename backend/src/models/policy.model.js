const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    // e.g. "return-policy", "exchange-policy", "privacy-policy", "terms"
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
