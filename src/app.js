require("dotenv").config();

// express
const express = require("express");
const app = express();

// part of Node.js (http module).
const path = require("path");
// We use http.Server to wrap the express app
const http = require("http");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const server = http.Server(app);
// Socket.IO is initialized with the server instance
const socketIO = require("socket.io");
const io = socketIO(server);
// Error modules
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
// server-side webSockets
// The server listens for new client connections.
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  // Send a test message to the client after connection
  socket.emit("test-message", "Hello from the server!");
  /* 1 */
  //  The server listens for a "started-typing" event by a specific connected client.
  socket.on(
    "started-typing",
    (user) => socket.broadcast.emit("started-typing", user)
    // When a user starts typing, the server broadcasts this event to all other connected clients
    //console.log("user:", user); // foo0.202123752699526 user is hard coded in Chat.js
  );

  socket.on("stopped-typing", (user) =>
    socket.broadcast.emit("stopped-typing", user)
  );

  socket.on("client-message", (message) => console.log(message));

  socket.on("message", async (message) => {
    const { userId, channelId, text } = message;
    // console.log("message:", message); // { userId: 'myId', channelId: '', text: 'lkjh\n' }

    const createdAt = Date.now();
    const createdMessage = await messageService.createMessage(
      userId,
      channelId,
      createdAt,
      text
    );
    // console.log("createdMessage:", createdMessage);

    socket.emit(createdMessage);
    socket.broadcast.emit(createdMessage);
  });
});

app.use(
  /* express-session */
  session({
    resave: false,
    saveUninitialized: true,
    name: "flack-session",
    secret: process.env.SECRET || "secret",
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/local",
    }),
  })
);

app.use(express.json()); //  parses incoming JSON requests.
app.use(express.urlencoded({ extended: false })); // When there is an HTTP POST request from the client with content type application/x-www-form-urlencoded, this middleware parses the data and populates the req.body object with key-value pairs.
app.use(express.static(path.join(__dirname, "..", "dist"))); // note on which files are rendered first in webpack.config.js

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
    req.session.userId = user.id; /* "id" or "_id" */
    res.redirect("/");
  })
);

app.get(
  "/api/v1/logged-in",
  catchError(async (req, res) => {
    const user = await userService.getUser(req.session.userId);
    res.json(UserView(user));
  })
);

// Channel Routes
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
  isLoggedIn, // if loggedIn it will return next()
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
Note on http modules:
http.Server() and http.createServer() are equivalent in functionality, but there is a slight difference in how they're used:

http.createServer()
======================
A shorthand method to create an HTTP server.
If passed a callback (e.g., a request handler), it automatically sets it up as the server's 'request' event listener.

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!");
});

http.Server()
=============
Directly creates an HTTP server instance without assigning a request listener.
You must manually add listeners to handle requests.

What Is Socket.IO?
==================
Socket.IO is a library that enables real-time, bidirectional, and event-driven communication between web clients and servers. It provides additional features like:

* Enable Real-Time Features:
    With Socket.IO, your app can instantly send and receive messages between clients and the server without requiring a page reload.

* Set Up Communication Protocols:
    By listening for WebSocket events (connection, message), you set the foundation for real-time features like live chat or notifications.

* Support Client-Side Socket.IO:
    Socket.IO ensures the server can communicate with client-side scripts using a similar API.

Example Workflow:
Client Connects:

A client establishes a WebSocket connection:
    const socket = io(); // Client-side

Client Sends a Message:
    socket.emit("message", "Hello, server!");

Server Receives and Logs the Message:
    socket.on("message", (message) => {
        console.log(message); // "Hello, server!"
    });

Server Responds:
    socket.emit("response", "Message received!");

Client Receives the Response:
    socket.on("response", (data) => {
        console.log(data); // "Message received!"
    });

    *** 1: 
* io.on("connection", callback)
    Purpose: Listens for a specific event ("connection") on the io instance.
    This means the server is waiting for a client to connect. When a client establishes a connection, the callback is executed with the socket object representing that connection.
    Key Point: This is a listener, not an emitter. It's triggered by the client connecting.

* socket.on("message", callback)
    Purpose: Listens for a specific event ("message") from the connected client.
    This means the server is waiting for the client to send a "message" event, and when it receives it, the callback is executed with the data sent by the client.

Key Point: This is also a listener, specifically for events sent by the client.

* emit
    Purpose: Emits an event. This is used to send data to the other side (client or server).
    For example:
    Server to Client: socket.emit("eventName", data)
    Client to Server: socket.emit("eventName", data)
    emit is the action, while on listens for that action.

*** express-session?
express-session is a middleware for Express.js that enables session management. It allows you to store and retrieve user-specific data across multiple requests, making it useful for features like authentication, user preferences, or maintaining a shopping cart in web applications.

Key Features
Session Creation and Management: Automatically creates and manages sessions for incoming requests.
Storage: Stores session data in memory by default but supports external storage systems like databases or caching layers (e.g., Redis, MongoDB).
Cookie-based Session ID: Uses a cookie to store the session ID on the client side while keeping session data on the server.
Customizable: Highly configurable, allowing you to define how sessions are stored, expired, and secured.
How It Works:
A session ID is generated and sent to the client in a cookie (default: connect.sid).
The server uses this session ID to retrieve and manage session data for that specific user.
Session data is stored on the server, either in memory (default) or in a session store like Redis, MongoDB, etc.

connect-mongo
=============

By default, session data is stored in memory, which is not ideal for production. To persist sessions, you can use external session stores like:
MongoDB: Scalable database for session storage.

*** "id" or "_id"
    ============

    Mongoose User Model Behavior
In Mongoose, a document usually has an _id field by default, which represents the unique identifier for that document in the database. This field is typically an ObjectId.

user._id: This is the actual MongoDB ObjectId assigned to the document.
user.id: Mongoose provides a virtual getter for the _id field, returning it as a string. So, user.id is essentially user._id.toString().
Your Scenario
If user is an instance of a Mongoose model, user.id will already give you the string representation of the _id field.
If your app logic relies on string comparisons (e.g., comparing session data to other strings), using user.id is often preferable because it avoids the need to manually convert ObjectId to a string.

*/
