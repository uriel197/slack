const SET_SELECTED_CHANNEL = "SIDEBAR/SET_SELECTED_CHANNEL";
const SET_CHANNELS = "SIDEBAR/SET_CHANNELS";

module.exports = {
  SET_SELECTED_CHANNEL,
  SET_CHANNELS,
};

/*
SET_SELECTED_CHANNEL is a string constant that represents the action type for setting the selected channel in the sidebar.
The format "SIDEBAR/SET_SELECTED_CHANNEL" is used as a namespace to avoid action type name conflicts. The prefix "SIDEBAR/" helps make it clear that this action is related to the sidebar features. This is a common practice, especially in large applications, to help avoid action type name collisions.
*/
