const store = require("../lib/store");
const { isLoggedIn } = require("../lib/api/usersApi");
const appReducer = require("./appReducer");
const appInitState = require("./initState");
const { SetUser } = require("./appActions");
const sidebarReducer = require("./sidebar/sidebarReducer");
const sidebarInitState = require("./sidebar/initState");
const Channel = require("./sidebar/Channel");
const chatReducer = require("./chat/chatReducer");
const chatInitState = require("./chat/initState");
const User = require("./User");
const { getChannels, createChannel } = require("../lib/api/channelsApi");
const { SetChannels } = require("./sidebar/sidebarActions");
const { SetTypingUser } = require("./chat/chatActions");
const {
  SetMessages,
  AddIncomingMessage,
  AddMessage,
} = require("./chat/chatActions");
const { getMessages } = require("../lib/api/chatApi");
const Message = require("./chat/Message");
const socketIO = require("socket.io-client");
const socket = socketIO();

(async () => {
  store.setReducer("app", appReducer, appInitState);
  store.setReducer("sidebar", sidebarReducer, sidebarInitState);
  store.setReducer("chat", chatReducer, chatInitState);

  // Using destructuring where incomingUser=isLoggedIn() and incomingChannels=getChannels()
  const [incomingUser, incomingChannels] = await Promise.all([
    isLoggedIn(), // from ../lib/api/usersApi
    getChannels(), // from ../lib/api/channelsApi
  ]);

  const user = User(incomingUser);
  let channels = incomingChannels.map(Channel); // Channel() from ./sidebar/Channel
  if (channels.length < 1) {
    const generalChannel = await createChannel("general");
    channels = [generalChannel];
  }

  const selectedChannel = channels.find(
    (channel) => channel.name === user.lastVisitedChannel
  );
  const messages = await getMessages(selectedChannel.id); // getMessages fetches res = await fetch(`/api/v1/messages/${channelId}`, req);
  store.dispatch(SetUser(user));
  store.dispatch(SetChannels(channels));
  store.dispatch(SetMessages(messages.map(Message)));
  // Explanations/dispatch-noReducers
  window.socket = socket;

  // the browser checks the index file of each of the following folders
  require("./alert");
  require("./sidebar");
  require("./header");
  require("./chat");
  require("./actionbar");

  // web-sockets
  window.socket.on("started-typing", (user) => {
    store.dispatch(SetTypingUser({ user, isTyping: true }));
  });
  window.socket.on("stopped-typing", (user) => {
    store.dispatch(SetTypingUser({ user, isTyping: false }));
  });
  window.socket.on("my-message", (message) => {
    store.dispatch(AddMessage(Message(message)));
  });

  window.socket.on("message", (message) =>
    store.dispatch(AddIncomingMessage(Message(message)))
  );
})();
/*
Summary
The require("./sidebar") in main.js:
Executes the index.js file in the sidebar folder.
Triggers all the setup logic for the sidebar (event listeners, DOM rendering, store configuration).
Uses Node.js's convention of loading index.js as the default file for a folder.
*/
