const ApiError = require("../utils/ApiError");
const logger = require("../logger/logger");


const errorMiddleware = (err, req, res, next) => {
  let apiError = err;

  if (!(err instanceof ApiError)) {
    // Translate a few common Mongoose error shapes into clean ApiErrors
    // instead of exposing raw driver messages.
    if (err.name === "ValidationError") {
      apiError = ApiError.badRequest("Validation failed", "VALIDATION_ERROR", err.errors);
    } else if (err.code === 11000) {
      apiError = ApiError.conflict("A record with this value already exists", "DUPLICATE_KEY");
    } else if (err.name === "CastError") {
      apiError = ApiError.badRequest("Invalid identifier", "INVALID_ID");
    } else {
      apiError = ApiError.internal();
    }
  }

  if (apiError.statusCode >= 500) {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl });
  } else {
    logger.warn(err.message, { path: req.originalUrl, code: apiError.code });
  }

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    code: apiError.code,
    ...(apiError.details ? { details: apiError.details } : {}),
  });
};

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: "ROUTE_NOT_FOUND",
  });
};

module.exports = { errorMiddleware, notFoundMiddleware };
