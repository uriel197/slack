const bcrypt = require("bcryptjs");
const CurrentUserView = require("./CurrentUserView");
const UserView = require("./UserView");

class UserService {
  constructor(Model, channelService) {
    // referance to UserModel
    this.Model = Model;
    this.channelService = channelService;
  }

  createUser = async (name) => {
    const user = await this.Model.find({ name }); /* 1 */
    if (user) throw new Error(`${name} is taken`);
    return new this.Model({ name }).save();
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
        [user.id] /* 3 */
      );
      await this.setLastVisitedChannel(user.id, channel.id);
    } else {
      const join = this.channelService.joinChannel(user.id, channel.id);
      const lastVisit = this.setLastVisitedChannel(user.id, channel.id);
      await Promise.all([join, lastVisit]);
    }
    return user;
  };

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

  getUser = (userId) => this.Model.findById(userId);

  getUsers = (userIdArray) =>
    this.Model.find({ _id: { $in: userIdArray } }); /* 2 */

  getUsersInChat = () => this.Model.find({});

  getCurrentUserView = async (userId) => {
    const user = await this.Model.findById(userId);
    if (!user) throw new Error(`User not found for id: ${userId}`);
    return new CurrentUserView(user);
  };

  setLastVisitedChannel = async (userId, channelId) => {
    const user = await this.getUser(userId);
    user.lastVisitedChannelId = channelId;
    return user.save();
  };
}

module.exports = UserService;

/*
    ======================================
        COMMENTS - COMMENTS - COMMENTS
    ======================================

*** 1: When you use an object like { name } in this.Model.find({ name }), JavaScript shorthand property names are at play. This means that name in { name } resolves to a key-value pair where the key is "name" and the value is the variable name. Since name is not explicitly defined in the schema, MongoDB doesn't validate the field against the schema during queries.

Mongoose doesn't enforce strict schema validation for queries by default, meaning it doesn't complain if you query using a field (name) that isn't in the schema. MongoDB simply performs the query as long as it matches any document with the given key-value pair, The this.Model.find({ name }) will still match documents where username has a value that matches the variable name. e.g. MongoDB looks for documents where { name: value } matches { username: value }

*** 2: This method takes an array of user IDs and fetches all users whose _id is in that array. It uses Mongoose's $in operator to find users by multiple IDs.

*** 3: [user.id] creates an array with the user ID as its only element.
The array is passed to the createChannel method to represent the members of the channel.

*/
