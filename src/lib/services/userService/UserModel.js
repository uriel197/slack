const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: { type: String, required: true },
  lastVisitedChannel: { type: String },
});

module.exports = mongoose.model("User", user);
