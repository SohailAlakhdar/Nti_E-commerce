const Policy = require("../models/policy.model");
const ApiError = require("../utils/ApiError");
const { toSlug } = require("../utils/slugify.util");
const { cache, CACHE_KEYS, invalidateByPrefix } = require("../cache/nodeCache");

const listPolicies = async () => {
  const cached = cache.get(CACHE_KEYS.POLICIES);
  if (cached) return cached;
  const policies = await Policy.find().sort({ title: 1 });
  cache.set(CACHE_KEYS.POLICIES, policies);
  return policies;
};

const getPolicyBySlug = async (slug) => {
  const cacheKey = CACHE_KEYS.POLICY_ONE(slug);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const policy = await Policy.findOne({ slug });
  if (!policy) throw ApiError.notFound("Policy not found", "POLICY_NOT_FOUND");

  cache.set(cacheKey, policy);
  return policy;
};

const upsertPolicy = async ({ slug, title, content }, adminId) => {
  const finalSlug = slug ? toSlug(slug) : toSlug(title);
  const policy = await Policy.findOneAndUpdate(
    { slug: finalSlug },
    { slug: finalSlug, title, content, updatedBy: adminId },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  invalidateByPrefix("policies:");
  return policy;
};

module.exports = { listPolicies, getPolicyBySlug, upsertPolicy };
