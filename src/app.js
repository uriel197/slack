// express
const express = require("express");
const app = express();

const catchError = require("./lib/utils/catchError");
const UserView = require("./lib/services/userService/UserView");
const config = require("./config");
const isLoggedIn = require("./lib/utils/isLoggedIn");
const isLoggedInWithRedirect = require("./lib/utils/isLoggedInWithRedirect");
const {
  channelService,
  messageService,
  userService,
} = require("./lib/services");

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
io.on("connection", (socket) => {
  socket.on("started-typing", (user) => {
    socket.broadcast.emit("started-typing", user);
  });

  socket.on("stopped-typing", (user) => {
    socket.broadcast.emit("stopped-typing", user);
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
    socket.broadcast.emit(createdMessage); // This line broadcasts the createdMessage to all other connected clients except the client that triggered the code.
  });
}); // Explanations/MessageView-UserView

app.use(
  session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: false,
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

app.get(
  "/",
  isLoggedInWithRedirect,
  catchError((req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "main.html"));
  })
);

app.get(
  "/register",
  catchError(async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
  })
);

app.get(
  "/login",
  catchError(async (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
  })
);

app.get(
  "/logout",
  catchError(async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  })
);

app.post(
  "/register",
  catchError(async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.registerUser(username, password);
    req.session.userId = user.id;
    res.redirect("/");
  })
);

app.post(
  "/login",
  catchError(async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.loginUser(username, password);
    req.session.userId = user.id;
    res.redirect("/");
  })
);

app.get(
  "/api/v1/logged-in",
  catchError(async (req, res) => {
    const user = await userService.getUser(req.session.userId);
    res.json(UserView(user)); // UserView transforms a database user object (retrieved via your backend) into a clean, frontend-friendly format.
  })
);

app.get(
  "/api/v1/messages/:channelId",
  isLoggedIn,
  catchError(async (req, res) => {
    const { channelId } = req.params;
    const views = await messageService.getMessageViews(channelId);
    res.json(views);
  })
);

app.get(
  "/api/v1/users",
  isLoggedIn,
  catchError(async (req, res) => {
    const users = await userService.getUsersInChat();
    res.json(users);
  })
);

app.get(
  "/api/v1/channels",
  isLoggedIn,
  catchError(async (req, res) => {
    const channels = await channelService.getChannels();
    res.json(channels);
  })
);

app.post(
  "/api/v1/channels",
  isLoggedIn,
  catchError(async (req, res) => {
    const { name } = req.body;
    const channel = await channelService.createChannel(name);
    res.json(channel);
  })
);

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
