const mongoose = require("mongoose");

const reply = new mongoose.Schema({
  userId: { type: String, required: true },
  messageId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Reply", reply);
