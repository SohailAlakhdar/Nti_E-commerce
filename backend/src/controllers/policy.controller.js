const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const policyService = require("../services/policy.service");

const list = asyncHandler(async (req, res) => {
  const policies = await policyService.listPolicies();
  res.json(new ApiResponse("Policies fetched", { policies }));
});

const getBySlug = asyncHandler(async (req, res) => {
  const policy = await policyService.getPolicyBySlug(req.params.slug);
  res.json(new ApiResponse("Policy fetched", { policy }));
});

const upsert = asyncHandler(async (req, res) => {
  const policy = await policyService.upsertPolicy(req.body, req.user._id);
  res.json(new ApiResponse("Policy saved", { policy }));
});

module.exports = { list, getBySlug, upsert };
