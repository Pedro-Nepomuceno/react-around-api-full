const mongoose = require("mongoose");

const { urlRegExp } = require("../utils/regex");

const validator = require("validator");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Pedro Nepomuceno",
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Sailor",
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'The "avatar" must be a valid url',
    },
  },
  email: {
    type: String,
    required: true,
    minLength: 4,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
