const ApiError = require("../utils/ApiError");


const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return next(ApiError.badRequest("Invalid request data", "VALIDATION_ERROR", details));
  }

  req.body = result.data.body ?? req.body;
  req.query = result.data.query ?? req.query;
  req.params = result.data.params ?? req.params;
  next();
};

module.exports = validate;
