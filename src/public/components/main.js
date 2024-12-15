const store = require("../lib/store");
const { isLoggedIn } = require("../lib/api/usersApi");
const appReducer = require("./appReducer");
const appInitState = require("./initState");
const { SetUser } = require("./appActions");
const sidebarReducer = require("./sidebar/sidebarReducer");
const sidebarInitState = require("./sidebar/initState");
const chatReducer = require("./chat/chatReducer");
const chatInitState = require("./chat/initState");
const { SetTypingUser } = require("./chat/chatActions");
const socketIO = require("socket.io-client");
const socket = socketIO();

(async () => {
  store.setReducer("app", appReducer, appInitState);
  store.setReducer("sidebar", sidebarReducer, sidebarInitState);
  store.setReducer("chat", chatReducer, chatInitState);

  const user = await isLoggedIn(); // isLoggedIn from usersApi.js
  store.dispatch(SetUser(user));
  window.socket = socket;

  // the browser checks the index file of each of the following folders
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
  window.socket.on("message", (message) => {
    console.log(message);
    console.log("--------------------------");
  });
})();
/*
Summary
The require("./sidebar") in main.js:
Executes the index.js file in the sidebar folder.
Triggers all the setup logic for the sidebar (event listeners, DOM rendering, store configuration).
Uses Node.js's convention of loading index.js as the default file for a folder.
*/
