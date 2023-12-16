const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  time: { type: Date, default: null },
});

const RegisterModel = mongoose.model("register", RegisterSchema);
module.exports = RegisterModel;
