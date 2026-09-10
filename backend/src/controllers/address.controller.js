const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const addressService = require("../services/address.service");

const list = asyncHandler(async (req, res) => {
  const addresses = await addressService.listForUser(req.user._id);
  res.json(new ApiResponse("Addresses fetched", { addresses }));
});

const getOne = asyncHandler(async (req, res) => {
  const address = await addressService.getOwned(req.user._id, req.params.id);
  res.json(new ApiResponse("Address fetched", { address }));
});

const create = asyncHandler(async (req, res) => {
  const address = await addressService.create(req.user._id, req.body);
  res.status(201).json(new ApiResponse("Address created", { address }));
});

const update = asyncHandler(async (req, res) => {
  const address = await addressService.update(req.user._id, req.params.id, req.body);
  res.json(new ApiResponse("Address updated", { address }));
});

const remove = asyncHandler(async (req, res) => {
  await addressService.remove(req.user._id, req.params.id);
  res.json(new ApiResponse("Address deleted"));
});

module.exports = { list, getOne, create, update, remove };
