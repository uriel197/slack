class MessageService {
  constructor(Model) {
    // referance to MessageModel
    this.Model = Model;
  }
  createMessage = (userId, channelId, createdAt, text) =>
    new this.Model({ userId, channelId, createdAt, text }).save();

  getMessages = (channelId) => this.Model.find({ channelId });
}

module.exports = MessageService;
