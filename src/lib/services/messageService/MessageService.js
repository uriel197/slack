class MessageService {
  constructor(Model) {
    this.Model = Model;
  }

  createMessage = (userId, channelId, createdAt, text) =>
    new this.Model({ userId, channelId, createdAt, text }).save(); //  a promise that resolves to the saved message.

  getMessages = (channelId) => this.Model.find({ channelId }); // fetches all messages for a specific channelId
}

module.exports = MessageService;

/*
        ========================================
            COMMENTS - COMMENTS - COMMENTS
        ========================================

When you pass the MessageModel to the MessageService constructor as Model, it allows you to interact with the properties and behavior defined in the schema (userId, channelId, createdAt, and text) in all the methods of the MessageService class.

*/
