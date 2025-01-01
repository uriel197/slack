const createElement = require("../../lib/createElement");
const ChannelsList = require("./components/channelList/ChannelsList");
const DirectMessagesList = require("./components/directMessagesList/DirectMessagesList");
const AlertDirectMessageList = require("../alert/components/alertDirectMessageList/AlertDirectMessageList");
const store = require("../../lib/store");
const { getUsersInChat } = require("../../lib/api/usersApi");
const { SetSelectedChannel } = require("./sidebarActions");
const { ShowAlert } = require("../alert/alertActions");
const createChannelButton = document.querySelector("[data-js=channels]");
const createDirectMessageButton = document.querySelector(
  "[data-js=direct-messages]"
);
const channelsList = document.querySelector("[data-js=channels-list]");
const directMessagesList = document.querySelector(
  "[data-js=direct-messages-list]"
);

createDirectMessageButton.addEventListener("click", async (event) => {
  const users = await getUsersInChat();
  const title = "Direct Messages";
  const alertDirectMessageList = new AlertDirectMessageList({ users });
  window.alertDirectMessageList = alertDirectMessageList;
  const data = {
    title,
    component: createElement(window.alertDirectMessageList),
  };

  store.dispatch(ShowAlert(data));
  // Explanations/dispatch-noReducers
});

createChannelButton.addEventListener("click", (event) => {
  alert("Show create channel modal");
});

const lastVisitedChannelId = store.state.app.user.lastVisitedChannelId;
const selectedChannel = store.state.sidebar.channels.find(
  (channel) => channel.id === lastVisitedChannelId
);

if (selectedChannel) {
  store.dispatch(SetSelectedChannel(selectedChannel));
}

window.channelsList = new ChannelsList();
const channelsNode = createElement(window.channelsList);

window.directMessagesList = new DirectMessagesList();

const directMessagesNode = createElement(window.directMessagesList);

channelsList.parentNode.replaceChild(channelsNode, channelsList);
directMessagesList.parentNode.replaceChild(
  directMessagesNode,
  directMessagesList
);

/*
    ===================================
      COMMENTS - COMMENTS - COMMENTS
    ===================================

Summary: 
This file is responsible for building and managing the sidebar of our chat application. It dynamically renders the list of channels and direct messages.

The require("./sidebar") statement in our main.js file is what triggers the execution of the index.js file inside the sidebar folder. This approach leverages Node.js's module resolution system, where index.js is the default file loaded when requiring a folder.
The purpose of index.js is to initialize and render the sidebar functionality directly when the application runs.

***1: Attaching channelsList and directMessagesList to the window:, Why?

Global Access:
By attaching channelsList and directMessagesList to the window object, they become globally accessible throughout our application.
This might be useful for debugging or if other parts of your app need to interact with these objects directly.

console.log(window.channelsList); // Access it from anywhere in the app

Debugging During Development:
Developers often attach objects to window for easier inspection in the browser's developer console.

*/
