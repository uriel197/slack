// express
const express = require("express");
const app = express();

const catchError = require("./lib/utils/catchError");
const { channelService, messageService } = require("./lib/services");

// We use http.Server to wrap the express app
const http = require("http");
const server = http.Server(app);
const path = require("path");

// Socket.IO is initialized with the server instance
const socketIO = require("socket.io");
const io = socketIO(server);

// The server listens for new client connections.
io.on("connection", (socket) => {
  /* 1 */
  socket.on("started-typing", (user) => {
    socket.broadcast.emit("started-typing", user);
  });
  socket.on("stopped-typing", (user) => {
    socket.broadcast.emit("stopped-typing", user);
  });
  socket.on("message", async (message) => {
    const { userId, channelId, text } = message;
    const createdAt = Date.now();
    const createdMessage = await messageService.createMessage(
      userId,
      channelId,
      createdAt,
      text
    );
    socket.emit(createdMessage);
    socket.broadcast.emit(createdMessage);
  });
  //  The server listens for a "message" event sent by a specific connected client.
  socket.on("message", (message) => {
    console.log(message);
    console.log("--------------------------");
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get(
  "/api/v1/channels",
  catchError(async (req, res) => {
    const channels = await channelService.getChannels();
    res.json(channels);
  })
);

app.post(
  "/api/v1/channels",
  catchError(async (req, res) => {
    const { name } = req.body;
    const channel = await channelService.createChannel(name);
    res.json(channel);
  })
);

app.all(
  "*",
  catchError((req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  })
);

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
*/
