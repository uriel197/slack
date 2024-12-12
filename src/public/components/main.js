// THIS WHOLE FILE IS THE FRONTEND DOWNLOADED BY WEBPACK
const store = require("../lib/store");
const { isLoggedIn } = require("../lib/api/usersApi");
const appReducer = require("./appReducer");
const appInitState = require("./initState");
const { SetUser } = require("./appActions");
const sidebarReducer = require("./sidebar/sidebarReducer");
const sidebarInitState = require("./sidebar/initState"); /* {selectedChannel: {
    name: "",
    _id: "",
  },
  channels: [],
}; */
const chatReducer = require("./chat/chatReducer");
const chatInitState = require("./chat/initState"); /* {typingUsers: {},}; */
const { SetTypingUser } = require("./chat/chatActions");
const socketIO = require("socket.io-client");
const socket = socketIO("http://localhost:3000");

(async () => {
  store.setReducer("app", appReducer, appInitState);
  store.setReducer("sidebar", sidebarReducer, sidebarInitState);
  store.setReducer("chat", chatReducer, chatInitState);

  const user = await isLoggedIn();
  store.dispatch(SetUser(user));
  window.socket = socket;

  // store.dispatch(SetTypingUser({ user: "testUser", isTyping: true }));  populates typingUser normally

  require("./sidebar");
  require("./header");
  require("./chat");
  require("./actionbar");

  // client-side webSockets
  window.socket.on("connect", () => {
    console.log("Connected to the server: ", socket.id);
  });

  window.socket.on("connect_error", (err) => {
    console.error("Socket connection error: ", err);
  });

  window.socket.on("test-message", (message) => {
    console.log(message);
    console.log("--------------------------");
  });

  window.socket.on("started-typing", (user) => {
    console.log("event received:", user);
    store.dispatch(SetTypingUser({ user, isTyping: true }));
  });

  window.socket.on("stopped-typing", (user) => {
    store.dispatch(SetTypingUser({ user, isTyping: false }));
  });

  window.socket.emit("client-message", "Hello from the client!");
})();

/*
Summary
The require("./sidebar") in main.js:

Executes the index.js file in the sidebar folder.
Triggers all the setup logic for the sidebar (event listeners, DOM rendering, store configuration).
Uses Node.js's convention of loading index.js as the default file for a folder.
*/
