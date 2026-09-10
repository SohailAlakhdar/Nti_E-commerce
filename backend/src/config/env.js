require("dotenv").config();

const required = (name) => {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,

  mongoUri: required("MONGO_URI"),

  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },

  jwt: {
    accessUserSecret: process.env.ACCESS_USER_TOKEN_SIGNATURE,
    refreshUserSecret: process.env.REFRESH_USER_TOKEN_SIGNATURE,
    accessSystemSecret: process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE,
    refreshSystemSecret: process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE,
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  },

  webClientIds: (process.env.WEB_CLIENT_IDS || "").split(",").filter(Boolean),

  allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  cacheTtl: parseInt(process.env.CACHE_TTL, 10) || 300,
};
