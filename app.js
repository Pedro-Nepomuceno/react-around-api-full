const express = require("express");

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
app.use((req, res, next) => {
  req.user = {
    _id: "6309393aa3874c93a2ab2b11",
  };

  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`app is listening`);
});
