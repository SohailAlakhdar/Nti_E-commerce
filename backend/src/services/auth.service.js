const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const logger = require("../logger/logger");
const {
  issueTokenPair,
  decodeRefreshTokenAnyRole,
  revokeRefreshToken,
  isRefreshTokenActive,
} = require("./token.service");

const register = async ({ name, email, phone, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists", "EMAIL_TAKEN");
  }

  // role is never taken from client input — always defaults to USER here.
  const user = await User.create({ name, email, phone, password });
  const tokens = await issueTokenPair(user);
  return { user: user.toSafeJSON(), tokens };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    logger.warn("Failed login attempt", { email });
    throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const tokens = await issueTokenPair(user);
  return { user: user.toSafeJSON(), tokens };
};

const refresh = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw ApiError.unauthorized("Refresh token missing", "REFRESH_TOKEN_MISSING");
  }

  const payload = decodeRefreshTokenAnyRole(rawRefreshToken);
  if (!payload) {
    throw ApiError.unauthorized("Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  const active = await isRefreshTokenActive(rawRefreshToken);
  if (!active) {
    throw ApiError.unauthorized("Refresh token expired or revoked", "REFRESH_TOKEN_REVOKED");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists", "USER_NOT_FOUND");
  }

  // Rotate: revoke the old refresh token and issue a brand new pair. This
  // limits the blast radius if a refresh token is ever stolen.
  await revokeRefreshToken(rawRefreshToken);
  const tokens = await issueTokenPair(user);
  return { user: user.toSafeJSON(), tokens };
};

const logout = async (rawRefreshToken) => {
  if (rawRefreshToken) {
    await revokeRefreshToken(rawRefreshToken);
  }
};

module.exports = { register, login, refresh, logout };
