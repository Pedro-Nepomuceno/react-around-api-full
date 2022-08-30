const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { model } = require("mongoose");

const SALT_ROUNDS = 10;

const registerAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: `ops something went wrong` });
  }
  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    Admin.findOne({ email }).then((admin) => {
      if (admin) {
        return res.status(418).send({ message: `user already exist` });
      }
      return Admin.create({ ...req.body, password: hash })
        .then((admin) => {
          return res.status(200).send(admin);
        })
        .catch((e) => {
          res.status(500).send("sorry try again");
        });
    });
  });
};

const authAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: `ops something went wrong` });
  }

  return Admin.findOne({ email }).then((admin) => {
    if (!admin) {
      return res.status(403).send({ message: `user does not exist` });
    }
    bcrypt.compare(password, admin.password, (err, isValidPassword) => {
      if (!isValidPassword) {
        return res.status(401).send({ message: "Invalid Password" });
      }
      return res.status(200).send(admin);
    });
  });
};

module.exports = { registerAdmin, authAdmin };
