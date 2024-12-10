const { SET_TYPING_USER } = require("./chatEvents");

const SetTypingUser = (value) => {
  console.log("Dispatching SET_TYPING_USER with value:", value);
  return {
    type: SET_TYPING_USER,
    value,
  };
};

module.exports = {
  SetTypingUser,
};
