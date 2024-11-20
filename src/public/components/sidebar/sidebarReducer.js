const { SET_SELECTED_CHANNEL } = require("./sidebarEvents");
module.exports = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_CHANNEL:
      return Object.assign({}, state, { selectedChannel: action.value });
    default:
      return state;
  }
};

/*

Why Use Object.assign?
======================

Immutability:
Object.assign({}, state, { selectedChannel: action.value }) ensures that the original state object is not modified.
It creates a new object by combining the properties of:
An empty object ({}).
The current state (state).
The updates ({ selectedChannel: action.value }).

process:
If the type matches SET_SELECTED_CHANNEL, it updates the state:
first it assigns the value to an empty object {}
if initial state = "",
store.state.sidebar: { selectedChannel: "general" }
next time it updates the state:
If the type matches SET_SELECTED_CHANNEL, it updates the state:
prev state = "{ selectedChannel: "general" }" is overwritten
new updated state: "{ selectedChannel: "foo" }"

*/