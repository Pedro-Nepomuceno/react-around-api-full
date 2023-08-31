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

try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  console.log(error);
  process.exit(1);
}

// mongoose.connect("mongodb://localhost:27017/react-around-api-full");

// this mongoose.connect("mongodb://127.0.0.1:27017/react-around-api-full");

const { requestLogger, errorLogger } = require("./middleware/logger");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://different-cowboy-hat-fly.cyclic.cloud",
  "https://around-us-5wjp.onrender.com",
  "https://react-around-api-full-rho.vercel.app",
  "https://pedro-nepomuceno.github.io/react-around-api-full",
  "http://localhost:3000", // Use the port your frontend is served on
  "http://localhost:3001", // Use the port your frontend is served on
];
app.use(cors({ origin: "*" }));

// app.options("*", cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

const { PORT = 3000 } = process.env;

app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`app is listening`);
});
