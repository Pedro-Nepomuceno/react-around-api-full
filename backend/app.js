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

app.options("*", cors());

app.use(
  cors({
    origin: "https://react-around-api-full-rho.vercel.app",
    allowedHeaders: "*",
  })
);

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

// if ($request_method = 'OPTIONS') {
//   add_header 'Access-Control-Allow-Origin' 'https://react-around-api-full-rho.vercel.app' ;
//   add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,referrer';
//   add_header 'Access-Control-Max-Age' 1728000;

// }

// add_header 'Access-Control-Allow-Origin' 'https://react-around-api-full-rho.vercel.app';
// add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, OPTIONS';
// add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
