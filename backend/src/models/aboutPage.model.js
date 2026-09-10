const mongoose = require("mongoose");

const aboutPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "About Us" },
    content: { type: String, required: true, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", aboutPageSchema);
