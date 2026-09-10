const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    oldStatus: { type: Number, required: true },
    newStatus: { type: Number, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
