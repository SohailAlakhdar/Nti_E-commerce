const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ROLES = require("../enums/roles.enum");
const User = require("../models/user.model");
const { verifyAccessToken } = require("../services/token.service");

const extractBearerToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
};


const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req);
  if (!token) throw ApiError.unauthorized("Authentication required", "NO_TOKEN");

  let payload = null;
  for (const role of Object.values(ROLES)) {
    try {
      payload = verifyAccessToken(token, role);
      break;
    } catch (error) {
      log.error("Token verification failed:", error.message);
    }
  }

  if (!payload) throw ApiError.unauthorized("Invalid or expired token", "INVALID_TOKEN");

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized("User no longer exists", "USER_NOT_FOUND");

  req.user = user;
  next();
});


const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req);
  if (!token) return next();

  for (const role of Object.values(ROLES)) {
    try {
      const payload = verifyAccessToken(token, role);
      const user = await User.findById(payload.sub);
      if (user) req.user = user;
      break;
    } catch (error) {
      log.error("Token verification failed:", error.message);
    }
  }
  next();
});

module.exports = { authenticate, optionalAuthenticate };
