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

app.use(
  cors({
    origin: "https://react-around-api-full-rho.vercel.app",
    allowedHeaders: ["Content-Type"],
  })
);
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-around-api-full-rho.vercel.app"
  );
  next();
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
