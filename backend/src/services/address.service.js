const Address = require("../models/address.model");
const ApiError = require("../utils/ApiError");

const listForUser = (userId) => Address.find({ user: userId }).sort({ createdAt: -1 });

const getOwned = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw ApiError.notFound("Address not found", "ADDRESS_NOT_FOUND");
  return address;
};

const create = (userId, payload) =>
  Address.create({ ...payload, user: userId });

const update = async (userId, addressId, payload) => {
  const address = await getOwned(userId, addressId);
  Object.assign(address, payload);
  await address.save();
  return address;
};

const remove = async (userId, addressId) => {
  const address = await getOwned(userId, addressId);
  await address.deleteOne();
};

module.exports = { listForUser, getOwned, create, update, remove };
