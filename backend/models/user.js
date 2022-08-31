const mongoose = require("mongoose");
const { urlRegExp } = require("../utils/regex");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
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

module.exports = mongoose.model("user", userSchema);
