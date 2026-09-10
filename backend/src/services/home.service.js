const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { ORDER_STATUS } = require("../enums/orderStatus.enum");
const { cache, CACHE_KEYS } = require("../cache/nodeCache");

const getNewArrivals = async (limit = 12) => {
  const cached = cache.get(CACHE_KEYS.NEW_ARRIVALS);
  if (cached) return cached;

  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);

  cache.set(CACHE_KEYS.NEW_ARRIVALS, products);
  return products;
};

/**
 * "Top sales" counts quantities sold only from DELIVERED orders (Section
 * 23/Rule 12) — cancelled/failed/pending/etc. never count, since they
 * either didn't happen or aren't confirmed as completed sales yet.
 */
const getTopSales = async (limit = 12) => {
  const cached = cache.get(CACHE_KEYS.TOP_SALES);
  if (cached) return cached;

  const results = await Order.aggregate([
    { $match: { status: ORDER_STATUS.DELIVERED } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $match: { "product.isActive": true } },
    {
      $project: {
        _id: 0,
        product: 1,
        totalSold: 1,
      },
    },
  ]);

  cache.set(CACHE_KEYS.TOP_SALES, results);
  return results;
};

module.exports = { getNewArrivals, getTopSales };
