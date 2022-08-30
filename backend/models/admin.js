const mongoose = require("mongoose");

const AdmSchema = new mongoose.Schema({
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

module.exports = mongoose.model("admin", AdmSchema);
