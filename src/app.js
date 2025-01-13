// express
const express = require("express");
const app = express();
const config = require("./config");

const { messageService, channelService } = require("./lib/services");
const {
  messageRoutes,
  userRoutes,
  generalRoutes,
  channelRoutes,
} = require("./routes");

// express-session
const session = require("express-session");
const MongoStore = require("connect-mongo");

// We use http.Server to wrap the express app
const http = require("http");
const server = http.Server(app);
const path = require("path");

// Socket.IO is initialized with the server instance
const socketIO = require("socket.io");
const io = socketIO(server);

// The server listens for new client connections.
io.on("connection", async (socket) => {
  socket.on("init", async (userId) => {
    socket.join(userId);
    const channels = await channelService.getChannels(userId);
    channels.forEach((channel) => {
      socket.join(channel.id);
    });
  });

  socket.on("leave", async (channelId) => {
    socket.leave(channelId);
  });

  socket.on("first-direct-message", (message) => {
    const { userId, channelId } = message;
    socket.to(userId).emit("first-direct-message", channelId);
  });

  socket.on("started-typing", (message) => {
    const { user, channelId } = message;

    socket.to(channelId).emit("started-typing", { user, channelId });
  });

  socket.on("stopped-typing", (message) => {
    const { user, channelId } = message;
    socket.to(channelId).emit("stopped-typing", { user, channelId });
  });

  socket.on("message", async (message) => {
    const { userId, channelId, text } = message;
    const createdAt = Date.now();
    const createdMessage = await messageService.createMessageView(
      userId,
      channelId,
      createdAt,
      text
    );

    socket.emit("my-message", createdMessage); // This line emits an event to the specific client (the socket that initiated the connection).
    socket.to(channelId).emit("my-message", createdMessage);
  });
}); // Explanations/MessageView-UserView

app.use(
  session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    name: "flack-session",
    store: MongoStore.create({
      mongoUrl: config.url,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // Optional: cookie expiration in milliseconds (14 days here)
    },
  })
); // Explanations/sessions

app.use(express.json());
app.use(express.urlencoded({ extended: false })); /* 1 */
app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/", [generalRoutes, messageRoutes, channelRoutes, userRoutes]);

app.use((req, res, next) => {
  res.status(404).end("404 not found");
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ error: error.message });
});

module.exports = server;

/*
    ======================================
        COMMENTS - COMMENTS - COMMENTS
    ======================================

***: Note on HTTP modules in Explanations/HTTP-network-flow

*** 1: extended: false
When extended is set to false, the querystring library is used to parse the URL-encoded data. This means it can only handle simple key-value pairs and does not support nested objects.

Example URL:

http://example.com?name=John&age=30
Parsed Result:

json
{
  "name": "John",
  "age": "30"
}
extended: true
When extended is set to true, the qs library is used to parse the URL-encoded data. This allows for rich objects and arrays to be encoded into the URL-encoded format, supporting nested objects.

Example URL:

http://example.com?user[name]=John&user[age]=30
Parsed Result:

json
{
  "user": {
    "name": "John",
    "age":

 

*/
