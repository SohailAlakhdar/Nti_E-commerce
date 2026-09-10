const mongoose = require("mongoose");
const logger = require("../logger/logger");
const env = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection failed", { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
