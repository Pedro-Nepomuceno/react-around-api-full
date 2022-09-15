const express = require("express");

require("dotenv").config();

const helmet = require("helmet");

const mongoose = require("mongoose");

const app = express();

const routes = require("./backend/routes/index");

app.use(helmet());

mongoose.connect("mongodb://localhost:27017/react-around-api-full", {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const { PORT = 3000 } = process.env;

app.use((err, req, res, next) => {
  res.status(500).send({ message: "An error occurred on the server" });
});

app.listen(PORT, () => {
  console.log(`app is listening`);
});

const crypto = require("crypto");

const randomString = crypto.randomBytes(16).toString("hex");
