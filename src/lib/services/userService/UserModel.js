const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  lastVisitedChannel: { type: String, default: "general" },
});

module.exports = mongoose.model("User", user);
