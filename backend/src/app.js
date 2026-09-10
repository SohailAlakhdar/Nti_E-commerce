const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const env = require("./config/env");
const apiV1Routes = require("./routes/index");
const { errorMiddleware, notFoundMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); 

app.get("/health", (req, res) => res.json({ success: true, message: "OK" }));

app.use("/api/v1", apiV1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
