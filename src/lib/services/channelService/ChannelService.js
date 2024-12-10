class ChannelService {
  constructor(Model) {
    this.Model = Model;
  }

  createChannel = (name) => new this.Model({ name }).save();

  getChannel = (channelId) => this.Model.findById(channelId); // It returns a promise with the channel document if found.

  getChannels = () => this.Model.find({});
}

module.exports = ChannelService;
