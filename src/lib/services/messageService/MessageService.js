const MessageView = require("./MessageView");

class MessageService {
  constructor(Model, userService) {
    this.userService = userService;
    // referance to MessageModel
    this.Model = Model;
  }

  createMessage = async (userId, channelId, createdAt, text) => {
    try {
      const message = await new this.Model({
        userId,
        channelId,
        createdAt,
        text,
      }).save();
      return message;
    } catch (error) {
      console.error("Error saving message to database:", error);
      throw error;
    }
  };

  createMessageView = async (userId, channelId, createdAt, text) => {
    const message = await this.createMessage(
      userId,
      channelId,
      createdAt,
      text
    ); //  saves the new message to the database
    const user = await this.userService.getUser(userId);
    return MessageView(message, user);
  };

  updateMessage = async (userId, messageId, text) => {
    const message = await this.Model.findOne({ _id: messageId, userId });
    message.text = text;
    const update = await message.save();
    const user = await this.userService.getUser(userId);
    return MessageView(update, user);
  };

  getMessage = (messageId) => this.Model.findById(messageId);

  getMessageView = async (messageId) => {
    const message = await this.getMessage(messageId);
    const user = await this.userService.getUser(message.userId);
    return MessageView(message, user);
  };

  getMessages = (channelId) => this.Model.find({ channelId });

  getMessageViews = async (channelId) => {
    const messages = await this.getMessages(channelId);
    const userIds = messages.map((message) => message.userId);
    const users = await this.userService.getUsers(userIds);
    return messages.map((message) => {
      const user = users.find((user) => user.id === message.userId);
      return MessageView(message, user);
    });
  };

  deleteMessage = async (userId, messageId) => {
    const message = await this.Model.findOneAndDelete({
      _id: messageId,
      userId,
    });

    if (!message) {
      throw new Error("Message not found or user not authorized.");
    }

    const user = await this.userService.getUser(userId);
    return MessageView(message, user);
  };
}

module.exports = MessageService;
