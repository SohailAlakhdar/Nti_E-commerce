const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./logger/logger");

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} [${env.nodeEnv}]`);
  });
};

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection", { error: err.message, stack: err.stack });
  process.exit(1);
});

start();
