class ChannelService {
  constructor(Model) {
    // referance to ChannelModel
    this.Model = Model;
  }

  createChannel = async (userId, name, type, usersInChannel) => {
    const fingerprint = Buffer.from(name.split("").sort().join("")).toString(
      "base64"
    );
    const channel = await this.Model.findOne({ fingerprint });
    if (!channel) {
      return new this.Model({
        name,
        fingerprint,
        type,
        usersInChannel,
      }).save();
    }
    const isInChannel = channel.usersInChannel.find((id) => id === userId);
    if (isInChannel) return channel;
    channel.usersInChannel.push(userId);
    return channel.save();
  };

  getChannel = (channelId) => this.Model.findById(channelId);

  getChannels = (userId) => this.Model.find({ usersInChannel: userId });

  getPublicChannels = () => this.Model.find({ type: "channel" });

  getChannelByName = (name) => {
    return this.Model.findOne({ name });
  };

  joinChannel = async (userId, channelId) => {
    const channel = await this.Model.findById(channelId);
    const isInChannel = channel.usersInChannel.find((id) => id === userId);
    if (isInChannel) return channel;
    channel.usersInChannel.push(userId);
    return channel.save();
  };

  leaveChannel = async (userId, channelId) => {
    const channel = await this.Model.findById(channelId);
    const users = channel.usersInChannel.filter((id) => id !== userId);
    channel.usersInChannel = users;
    return channel.save();
  };
}

module.exports = ChannelService;
