const NodeCache = require("node-cache");

const CACHE_TTL = parseInt(process.env.CACHE_TTL, 10) || 300;

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 60 });

const CACHE_KEYS = Object.freeze({
  PRODUCT_LIST: "products:list",
  PRODUCT_DETAIL: (slug) => `products:detail:${slug}`,
  SHIPPING_POLICY: "shipping:policy",
  POLICIES: "policies:all",
  POLICY_ONE: (slug) => `policies:one:${slug}`,
  TESTIMONIALS_PUBLIC: "testimonials:public",
  NEW_ARRIVALS: "home:new-arrivals",
  TOP_SALES: "home:top-sales",
  ABOUT_PAGE: "about:page",
});


const invalidateByPrefix = (prefix) => {
  const keys = cache.keys().filter((k) => k.startsWith(prefix));
  if (keys.length) cache.del(keys);
};

module.exports = { cache, CACHE_KEYS, invalidateByPrefix };
