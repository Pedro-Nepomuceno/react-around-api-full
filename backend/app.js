const express = require("express");

require("dotenv").config();

const helmet = require("helmet");

const mongoose = require("mongoose");

const app = express();

const routes = require("./routes/index");

app.use(helmet());

const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/react-around-api-full", {
  useNewUrlParser: true,
});

const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middleware/logger");

const allowedOrigins = [
  "https://www.pedronepomuceno.students.nomoredomainssbs.ru/",
  "https://pedronepomuceno.students.nomoredomainssbs.ru/",
  "http://localhost:3000", // Use the port your frontend is served on
];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

const { PORT = 3000 } = process.env;

app.use((err, req, res, next) => {
  res.status(500).send({ message: "An error occurred on the server" });
});

app.listen(PORT, () => {
  console.log(`app is listening`);
});

const crypto = require("crypto");

const randomString = crypto.randomBytes(16).toString("hex");
