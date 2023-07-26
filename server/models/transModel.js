const mongoose = require("mongoose");
const moment = require('moment-timezone');

//Create Schema
const userDataSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    amount:{
        type: Number,
        required: true
    },
  },
  { timestamps: true }
);

//Create Model
const transData = mongoose.model("trans", userDataSchema);

module.exports = transData;