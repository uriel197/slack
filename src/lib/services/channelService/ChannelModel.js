const mongoose = require("mongoose");

const channel = new mongoose.Schema({
  name: { type: String, required: true },
  usersInChannel: { type: Array, default: [] },
});
module.exports = mongoose.model("Channel", channel);
