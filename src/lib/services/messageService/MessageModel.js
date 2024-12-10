const mongoose = require("mongoose");

const message = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  channelId: {
    type: String,
    ref: "Channel" /* 1 */,
    required: true,
  },

  createdAt: { type: Date, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Message", message);

/*
        ========================================
            COMMENTS - COMMENTS - COMMENTS
        ========================================

In MongoDB, every document automatically has a unique _id field. When you define channelId in your MessageModel with ref: "Channel", it means that channelId in the Message schema is expected to store the _id of a document in the Channel collection.

So, while ChannelModel does not explicitly define a channelId field, the default _id field of each Channel serves this purpose.

*/
