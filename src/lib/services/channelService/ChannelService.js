class ChannelService {
  constructor(Model) {
    // referance to ChannelModel
    this.Model = Model;
  }

  createChannel = async (name, type, usersInChannel) => {
    const fingerprint = Buffer.from(name.split("").sort().join("")).toString(
      "base64"
    );
    const channel = await this.Model.findOne({ fingerprint });
    if (channel) return channel;
    return new this.Model({
      name,
      fingerprint,
      type,
      usersInChannel,
    }).save();
  };

  getChannel = (channelId) => this.Model.findById(channelId);

  getChannels = (userId) => this.Model.find({ usersInChannel: userId });
}

module.exports = ChannelService;
