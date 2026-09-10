const mongoose = require("mongoose");
const { ORDER_STATUS, VALID_STATUS_VALUES } = require("../enums/orderStatus.enum");
const PAYMENT_METHOD = require("../enums/paymentMethod.enum");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const orderAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    city: String,
    area: String,
    street: String,
    building: String,
    floor: String,
    apartment: String,
    notes: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    address: { type: orderAddressSchema, required: true },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.CASH_ON_DELIVERY,
    },
    status: {
      type: Number,
      enum: VALID_STATUS_VALUES,
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    orderedAt: { type: Date, default: Date.now, index: true },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Order", orderSchema);
