const ChannelService = require("./channelService/ChannelService");
const ChannelModel = require("./channelService/ChannelModel");
const MessageService = require("./messageService/MessageService");
const MessageModel = require("./messageService/MessageModel");
const UserService = require("./userService/UserService");
const UserModel = require("./userService/UserModel");

// instances of the Models
const userService = new UserService(UserModel);
const messageService = new MessageService(MessageModel);
const channelService = new ChannelService(ChannelModel);

module.exports = {
  userService,
  messageService,
  channelService,
};
