class ChannelService {
  constructor(Model) {
    // referance to ChannelModel
    this.Model = Model;
  }

  createChannel = (name) => new this.Model({ name }).save();

  getChannel = (channelId) => this.Model.findById(channelId);

  getChannels = () => this.Model.find({});
}
module.exports = ChannelService;
