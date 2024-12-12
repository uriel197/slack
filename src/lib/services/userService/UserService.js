const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
class UserService {
  constructor(Model) {
    this.Model = Model;
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
    return new this.Model({ username, password: hash }).save();
  };

  setLastVisitedChannel = async (userId, channelId) => {
    const user = await this.getUser(userId);
    user.lastVisitedChannel = channelId;
    return user.save();
  };

  createUser = (name) => new this.Model({ name }).save();

  getUser = (userId) => this.Model.findById(userId);

  getUsers = (userIdArray) => this.Model.find({ _id: { $in: userIdArray } }); // This method takes an array of user IDs and fetches all users whose _id is in that array. It uses Mongoose's $in operator to find users by multiple IDs.
}

module.exports = UserService;
