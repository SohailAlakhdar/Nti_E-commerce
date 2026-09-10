const ShippingPolicy = require("../models/shippingPolicy.model");
const { cache, CACHE_KEYS } = require("../cache/nodeCache");

const getActivePolicy = async () => {
  const cached = cache.get(CACHE_KEYS.SHIPPING_POLICY);
  if (cached) return cached;

  let policy = await ShippingPolicy.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!policy) {
    // Sensible default so checkout never breaks on a fresh install.
    policy = await ShippingPolicy.create({ title: "Shipping Policy", content: "", shippingCost: 0 });
  }
  cache.set(CACHE_KEYS.SHIPPING_POLICY, policy);
  return policy;
};

const updatePolicy = async (payload, adminId) => {
  let policy = await ShippingPolicy.findOne({ isActive: true }).sort({ updatedAt: -1 });
  if (!policy) policy = new ShippingPolicy();

  const allowed = ["title", "content", "shippingCost", "isActive"];
  for (const field of allowed) {
    if (payload[field] !== undefined) policy[field] = payload[field];
  }
  policy.updatedBy = adminId;
  await policy.save();

  cache.del(CACHE_KEYS.SHIPPING_POLICY);
  return policy;
};

module.exports = { getActivePolicy, updatePolicy };
