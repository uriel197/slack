const bcrypt = require("bcryptjs");
const CurrentUserView = require("./CurrentUserView");
const UserView = require("./UserView");

class UserService {
  constructor(Model, channelService) {
    // referance to UserModel
    this.Model = Model;
    this.channelService = channelService;
  }

  loginUser = async (username, password) => {
    const maybeUser = await this.Model.findOne({ username });
    if (!maybeUser) throw new Error("unauthorized");
    const isCorrectPassword = await bcrypt.compare(
      password,
      maybeUser.password
    );
    if (!isCorrectPassword) throw new Error("unauthorized");
    return maybeUser;
  };

  registerUser = async (username, password) => {
    const maybeUser = await this.Model.findOne({ username });
    if (maybeUser) throw new Error("Username taken");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await new this.Model({ username, password: hash }).save();
    const channel = await this.channelService.getChannelByName("general");
    if (!channel) {
      const channel = await this.channelService.createChannel(
        "general",
        "channel",
        [user.id]
      );
      await this.setLastVisitedChannel(user.id, channel.id);
    } else {
      const join = this.channelService.joinChannel(user.id, channel.id);
      const lastVisit = this.setLastVisitedChannel(user.id, channel.id);
      await Promise.all([join, lastVisit]);
    }
    return user;
  };

  setLastVisitedChannel = async (userId, channelId) => {
    const user = await this.getUser(userId);
    user.lastVisitedChannelId = channelId;
    return user.save();
  };

  createUser = async (name) => {
    const user = await this.Model.find({ name });
    if (user) throw new Error(`${name} is taken`);
    return new this.Model({ name }).save();
  };

  getUsersInChat = () => this.Model.find({});

  getUser = (userId) => this.Model.findById(userId);

  getCurrentUserView = async (userId) => {
    const user = await this.Model.findById(userId);
    if (!user) throw new Error(`User not found for id: ${userId}`);
    return new CurrentUserView(user);
  };

  getUsers = (userIdArray) =>
    this.Model.find({ _id: { $in: userIdArray } }); /* 1 */
}

module.exports = UserService;

/*
    ======================================
        COMMENTS - COMMENTS - COMMENTS
    ======================================

*** 1: This method takes an array of user IDs and fetches all users whose _id is in that array. It uses Mongoose's $in operator to find users by multiple IDs.

*/
