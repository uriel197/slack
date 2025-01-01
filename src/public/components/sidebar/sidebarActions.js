const createAction = require("../../lib/createAction");
const {
  SET_SELECTED_CHANNEL,
  SET_CHANNELS,
  ADD_CHANNEL,
} = require("./sidebarEvents");

const SetChannels = createAction(SET_CHANNELS);
const AddChannel = createAction(ADD_CHANNEL);
const SetSelectedChannel = createAction(SET_SELECTED_CHANNEL);

module.exports = {
  SetChannels,
  SetSelectedChannel,
  AddChannel,
};

/*
SetSelectedChannel is an action creator. It is a function that takes a value (in this case, the channel name or ID) and returns an action object.
This returned object represents the action you want to send to the store object.

returns {
  type: "SET_SELECTED_CHANNEL",
  value: "general or foo"
}
  
you can think of actions as similar to events in our application. Here's why:

Both Represent "Something Happened":

An event is triggered when something happens in the browser, like a button click or a keypress.
An action in your code represents something that happened in the application, like a user selecting a channel very much like an event carries data, like which key was pressed or which button was clicked, in the same way, an action carries data about what happened in your app.
Example:

const action = { type: "SET_SELECTED_CHANNEL", value: "general" };
Both, the event and an action Need to Be Handled:

In the case of events we write event listeners to handle events and respond to them, in the case of actions we write reducers to handle actions and update the state based on them.
Example:

switch (action.type) {
  case "SET_SELECTED_CHANNEL":
    return { ...state, selectedChannel: action.value };
}

Key Difference:
Events are tied to the DOM or browser: They happen because of user interaction with the UI.
Actions are tied to your application's logic: They represent what should happen in your app and are used to modify your app's state.
*/
