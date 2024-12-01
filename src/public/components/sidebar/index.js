const createElement = require("../../lib/createElement");
const ChannelsList = require("./ChannelsList");
const DirectMessagesList = require("./DirectMessagesList");
const sidebarReducer = require("./sidebarReducer");
const initState = require("./initState");
const store = require("../../lib/store");

// querySelector
const createChannelButton = document.querySelector("[data-js=channels]");
const createDirectMessageButton = document.querySelector(
  "[data-js=direct-messages]"
);
const channelsList = document.querySelector("[data-js=channels-list]");
const directMessagesList = document.querySelector(
  "[data-js=direct-messages-list]"
);

// eventListeners
createDirectMessageButton.addEventListener("click", (event) => {
  alert("Show create direct message modal");
});
createChannelButton.addEventListener("click", (event) => {
  alert("Show create channel modal");
});

// Initialize and Render Components
const channels = [{ channelName: "general" }, { channelName: "foo" }];
window.channelsList = new ChannelsList({ channels });
const channelsNode = createElement(window.channelsList);
const directMessages = [{ channelName: "general" }, { channelName: "foo" }];
/* 1 */
window.directMessagesList = new DirectMessagesList({ directMessages });
const directMessagesNode = createElement(window.directMessagesList);
channelsList.parentNode.replaceChild(channelsNode, channelsList);
directMessagesList.parentNode.replaceChild(
  directMessagesNode,
  directMessagesList
);

// Integrate with store
store.setReducer("sidebar", sidebarReducer, initState);

/*
    ===================================
      COMMENTS - COMMENTS - COMMENTS
    ===================================

Summary: 
This file is responsible for building and managing the sidebar of your chat application. It dynamically renders the list of channels and direct messages, wires up user interaction, and integrates with the app’s global state. Its modular design ensures easy maintenance and scalability.

The require("./sidebar") statement in our main.js file is what triggers the execution of the index.js file inside the sidebar folder. This approach leverages Node.js's module resolution system, where index.js is the default file loaded when requiring a folder.
The purpose of index.js is to initialize and render the sidebar functionality directly when the application runs.

***1: Attaching channelsList and directMessagesList to the window:, Why?

Global Access:
By attaching channelsList and directMessagesList to the window object, they become globally accessible throughout your application.
This might be useful for debugging or if other parts of your app need to interact with these objects directly.

console.log(window.channelsList); // Access it from anywhere in the app

Debugging During Development:
Developers often attach objects to window for easier inspection in the browser's developer console.
For example, you can directly check or manipulate the state of channelsList in the console.

*/
