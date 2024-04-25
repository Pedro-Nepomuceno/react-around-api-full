const express = require("express");

require("dotenv").config();

const mongoose = require("mongoose");

const helmet = require("helmet");

const cors = require("cors");

const { errors } = require("celebrate");

const errorHandling = require("./middleware/errorHandling");

const app = express();

const routes = require("./routes/index");

app.use(helmet());

const limiter = require("./middleware/rateLimiter");

app.use(limiter);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI);

const { requestLogger, errorLogger } = require("./middleware/logger");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://react-around-api-full-rho.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  // );
  next();
});

// app.use(
//   cors({
//     origin: "https://react-around-api-full-rho.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.options("/signup", (req, res) => {
  // Set CORS headers
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-around-api-full-rho.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST");

  // Log CORS headers
  console.log("CORS headers:", res.getHeaders());

  // Respond to preflight request
  res.status(200).end();
});

app.options("*", cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

const { PORT = 3001 } = process.env;

app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`app is listening`);
});
