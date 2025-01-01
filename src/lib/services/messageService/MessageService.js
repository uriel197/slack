const MessageView = require("./MessageView");

class MessageService {
  constructor(Model, userService) {
    this.userService = userService;
    // referance to MessageModel
    this.Model = Model;
  }

  createMessageView = async (userId, channelId, createdAt, text) => {
    console.log("Creating message view with:", {
      userId,
      channelId,
      createdAt,
      text,
    });
    const message = await this.createMessage(
      userId,
      channelId,
      createdAt,
      text
    );
    const user = await this.userService.getUser(userId);
    console.log("Message created and user fetched:", { message, user });
    return MessageView(message, user);
  };

  //   createMessageView = async (userId, channelId, createdAt, text) => {
  //     const message = await this.createMessage(
  //       userId,
  //       channelId,
  //       createdAt,
  //       text
  //     ); //  saves the new message to the database
  //     const user = await this.userService.getUser(userId);
  //     return MessageView(message, user);
  //   };

  getMessageViews = async (channelId) => {
    const messages = await this.getMessages(channelId);
    const userIds = messages.map((message) => message.userId);
    const users = await this.userService.getUsers(userIds);
    return messages.map((message) => {
      const user = users.find((user) => user.id === message.userId);
      return MessageView(message, user);
    });
  };

  createMessage = async (userId, channelId, createdAt, text) => {
    try {
      const message = await new this.Model({
        userId,
        channelId,
        createdAt,
        text,
      }).save();
      console.log("Message saved to database:", message);
      return message;
    } catch (error) {
      console.error("Error saving message to database:", error);
      throw error;
    }
  };

  //   createMessage = (userId, channelId, createdAt, text) =>
  //     new this.Model({ userId, channelId, createdAt, text }).save();

  getMessages = (channelId) => this.Model.find({ channelId });
}

module.exports = MessageService;
