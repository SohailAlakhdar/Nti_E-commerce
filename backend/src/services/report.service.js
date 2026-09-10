const Order = require("../models/order.model");
const { ORDER_STATUS } = require("../enums/orderStatus.enum");

// Reused everywhere reports need to isolate "real" sales (Section 24/Rule 12).
const DELIVERED_MATCH = { status: ORDER_STATUS.DELIVERED };

const getOverview = async () => {
  const [statusCounts, deliveredAgg] = await Promise.all([
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: DELIVERED_MATCH },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          deliveredOrders: { $sum: 1 },
          totalProductsSold: { $sum: { $sum: "$items.quantity" } },
        },
      },
    ]),
  ]);

  const countsByStatus = statusCounts.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const totalOrders = statusCounts.reduce((sum, s) => sum + s.count, 0);
  const delivered = deliveredAgg[0] || { totalSales: 0, deliveredOrders: 0, totalProductsSold: 0 };

  return {
    totalSales: delivered.totalSales,
    totalOrders,
    deliveredOrders: delivered.deliveredOrders,
    cancelledOrders: countsByStatus[ORDER_STATUS.CANCELLED] || 0,
    pendingOrders: countsByStatus[ORDER_STATUS.PENDING] || 0,
    totalProductsSold: delivered.totalProductsSold,
  };
};

const getSalesByDay = async ({ from, to } = {}) => {
  const match = { ...DELIVERED_MATCH };
  if (from || to) {
    match.orderedAt = {};
    if (from) match.orderedAt.$gte = new Date(from);
    if (to) match.orderedAt.$lte = new Date(to);
  }

  return Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderedAt" } },
        sales: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getSalesByMonth = async () =>
  Order.aggregate([
    { $match: DELIVERED_MATCH },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$orderedAt" } },
        sales: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

const getTopSellingProducts = async (limit = 10) =>
  Order.aggregate([
    { $match: DELIVERED_MATCH },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.name" },
        quantitySold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.total" },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: limit },
  ]);

const getSalesByCategory = async () =>
  Order.aggregate([
    { $match: DELIVERED_MATCH },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$productInfo.subCategory", "UNKNOWN"] },
        revenue: { $sum: "$items.total" },
        quantitySold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

module.exports = {
  getOverview,
  getSalesByDay,
  getSalesByMonth,
  getTopSellingProducts,
  getSalesByCategory,
};
