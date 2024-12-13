class UserService {
  constructor(Model) {
    // referance to UserModel
    this.Model = Model;
  }

  setLastVisitedChannel = async (userId, channelId) => {
    const user = await this.getUser(userId);
    user.lastVisitedChannel = channelId;
    return user.save();
  };

  createUser = (name) => new this.Model({ name }).save();

  getUser = (userId) => this.Model.findById(userId);

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
