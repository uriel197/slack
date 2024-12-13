const mongoose = require("mongoose");

const message = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Message", message);
