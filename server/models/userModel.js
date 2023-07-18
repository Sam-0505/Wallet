const mongoose = require("mongoose");

//Create Schema
const userDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password:{
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

//Create Model
const userData = mongoose.model("UserData", userDataSchema);

module.exports = userData;