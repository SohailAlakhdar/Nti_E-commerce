const ApiError = require("../utils/ApiError");
const ROLES = require("../enums/roles.enum");

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return next(ApiError.forbidden("Admin access required", "ADMIN_ONLY"));
  }
  next();
};

module.exports = { authorizeAdmin };
