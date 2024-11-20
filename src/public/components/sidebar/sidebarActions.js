const { SET_SELECTED_CHANNEL } = require("./sidebarEvents");
const SetSelectedChannel = (value) => {
  return {
    type: SET_SELECTED_CHANNEL,
    value,
  };
};
module.exports = {
  SetSelectedChannel,
};

/*
SetSelectedChannel is an action creator. It is a function that takes a value (in this case, the channel name or ID) and returns an action object.
This returned object represents the action you want to send to the Redux store (or in your case, the store object).

returns {
  type: "SET_SELECTED_CHANNEL",
  value: "general or foo"
}
  
you can think of actions as similar to events in our application. Here's why:

Both Represent "Something Happened":

An event is triggered when something happens in the browser, like a button click or a keypress.
An action in your code represents something that happened in the application, like a user selecting a channel.
Both Carry Information About What Happened:

An event carries data, like which key was pressed or which button was clicked.
Example:

document.addEventListener("click", (event) => {
  console.log(event.target); // The clicked element
});
An action carries data about what happened in your app.
Example:

const action = { type: "SET_SELECTED_CHANNEL", value: "general" };
Both Need to Be Handled:

You write event listeners to handle events and respond to them.
Example:

button.addEventListener("click", () => {
  console.log("Button clicked!");
});

You write reducers to handle actions and update the state based on them.
Example:

switch (action.type) {
  case "SET_SELECTED_CHANNEL":
    return { ...state, selectedChannel: action.value };
}

Key Difference:
Events are tied to the DOM or browser: They happen because of user interaction with the UI.
Actions are tied to your application's logic: They represent what should happen in your app and are used to modify your app's state.
*/
