const UserView = require("../userService/UserView");

const MessageView = (message, user) => {
  const view = Object.assign({}, message._doc, { user: new UserView(user) });
  if (view) {
    console.log("view:", view);
  } else {
    console.log("no view found");
  }
  delete view.userId;
  return view;
};

module.exports = MessageView;
