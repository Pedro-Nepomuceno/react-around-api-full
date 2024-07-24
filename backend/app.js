const express = require("express");

const cors = require("cors");

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");

const helmet = require("helmet");

const { errors } = require("celebrate");

const errorHandling = require("./middleware/errorHandling");

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

app.options("*", cors());

app.use((req, res, next) => {
  console.log("CORS headers:", res.getHeaders());
  next();
});

const routes = require("./routes/index");

app.use(helmet());

const limiter = require("./middleware/rateLimiter");

app.use(limiter);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const { requestLogger, errorLogger } = require("./middleware/logger");

app.use(requestLogger);

app.use(errorLogger);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.statusCode || 500).send({
    message: err.message || "An error occurred on the server",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errors());

const PORT = process.env.PORT || 4000;

app.use(errorHandling);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(500)
    .send({ message: "An error occurred on the server", error: err.message });
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});

console.log(`Server starting... ${new Date().toISOString()}`);
