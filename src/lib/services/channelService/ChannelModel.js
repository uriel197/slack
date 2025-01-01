const mongoose = require("mongoose");

const channel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  fingerprint: {
    type: String,
    required: true,
  },

  usersInChannel: {
    type: Array,
    default: [],
  },

  type: {
    type: String,
    enum: ["channel", "directMessage"],
    required: true,
  },
});

module.exports = mongoose.model("Channel", channel);
