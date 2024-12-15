const createElement = require("../../lib/createElement");
const ChannelsList = require("./ChannelsList");
const DirectMessagesList = require("./DirectMessagesList");
const store = require("../../lib/store");
const { SetChannels, SetSelectedChannel } = require("./sidebarActions");
const { getChannels } = require("../../lib/api/channelsApi");

(async () => {
  const createChannelButton = document.querySelector("[data-js=channels]");
  const createDirectMessageButton = document.querySelector(
    "[data-js=direct-messages]"
  );
  const channelsList = document.querySelector("[data-js=channels-list]");
  const directMessagesList = document.querySelector(
    "[data-js=direct-messages-list]"
  );

  // event listeners
  createDirectMessageButton.addEventListener("click", (event) => {
    alert("Show create direct message modal");
  });

  createChannelButton.addEventListener("click", (event) => {
    alert("Show create channel modal");
  });

  // channels rendering
  const channels = await getChannels();
  store.dispatch(SetChannels(channels));
  const lastVisitedChannel = store.state.app.user.lastVisitedChannel;
  const selectedChannel = channels.find(
    (channel) => channel.name === lastVisitedChannel
  );
  console.log(selectedChannel);

  store.dispatch(SetSelectedChannel(selectedChannel));

  window.channelsList = new ChannelsList();
  const channelsNode = createElement(window.channelsList);
  const directMessages = [];
  window.directMessagesList = new DirectMessagesList({ directMessages });
  const directMessagesNode = createElement(window.directMessagesList);
  channelsList.parentNode.replaceChild(channelsNode, channelsList);
  directMessagesList.parentNode.replaceChild(
    directMessagesNode,
    directMessagesList
  );
})();

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
