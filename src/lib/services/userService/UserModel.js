const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  lastVisitedChannelId: {
    type: String,
  },

  unreadMessages: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("User", user);
