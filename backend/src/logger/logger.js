const path = require("path");
const winston = require("winston");
const REDACTED_KEYS = [
  "password",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "jwtSecret",
  "cloudinaryApiSecret",
  "apiSecret",
];

const redact = winston.format((info) => {
  const scrub = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key of Object.keys(obj)) {
      if (REDACTED_KEYS.includes(key)) {
        obj[key] = "[REDACTED]";
      } else if (typeof obj[key] === "object") {
        scrub(obj[key]);
      }
    }
    return obj;
  };
  return scrub(info);
});

const logsDir = path.join(__dirname, "logs");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    redact(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
