const express = require("express");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");

const helmet = require("helmet");

const { errors } = require("celebrate");

const errorHandling = require("./middleware/errorHandling");

// app.use(
//   cors({
//     origin: "*",
//     allowedHeaders: "*",
//   }),
// );

// app.options("*", cors());

const allowedOrigins = ["http://localhost:3000", "https://apiaroundreact.net"];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin like curl/postman or same-origin server calls
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("CORS headers:", res.getHeaders());
  next();
});

app.use(cookieParser());

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

// Final global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // If a previous middleware already started the response, don't send another one
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof URIError) {
    return res.status(400).json({ message: "Bad request" });
  }

  const status = err.statusCode || err.status || 500;

  return res.status(status).json({
    message: "An error occurred on the server",
    error: err.message,
  });
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`app is listening on port ${PORT}`);
});

console.log(`Server starting... ${new Date().toISOString()}`);
