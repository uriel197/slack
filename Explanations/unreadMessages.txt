where unread messages start:

routes.js:
Here is where setUnreadMessages is updated. this file runs when app.js(client-side) runs at the begining of the application.

router.add("/channels/:channelId", async (params) => {
  window.socket.emit("init", store.state.app.user.id);
  store.dispatch(ResetTypingUsers());
  const { channelId } = params;
  const incomingChannels = await getChannels();
  const channels = incomingChannels.map((incoming) =>
    Channel(incoming, store.state.app.user)
  );
  store.dispatch(SetChannels(channels));
  const channel = channels.find((channel) => channel.id === channelId);

  store.dispatch(SetSelectedChannel(channel));
  setLastVisitedChannel(channelId);
  const messages = await getMessages(channelId);
  store.dispatch(
    SetMessages(messages.map((incoming) => new Message(incoming)))
  );
  store.dispatch(ScrollToBottom());
********************************************
  const incomingUser = await setUnreadMessages(channelId, 0);
  const user = User(incomingUser);
  store.dispatch(SetUser(user));
********************************************
});


Chat.js:
=======

postMessage = (event) => {
    event.preventDefault();
    if (event.keyCode === RETURN_KEY && !event.shiftKey) {
      this._sendMessage(event, "message");
    } else if (event.keyCode === RETURN_KEY) {
      this.dispatch(AddTextAreaRow(textAreaName));
    }

    const user = this.getStoreState().app.user.username;
    const channelId = this.getStoreState().sidebar.selectedChannel.id;

    if (event.target.value.length < 1) {
      this.dispatch(ResetTextAreaHeight(textAreaName));
      window.socket.emit("stopped-typing", { channelId, user });
    } else if (event.target.value.length > 0) {
      window.socket.emit("started-typing", { channelId, user });
    }
  };

  _sendMessage = (event, eventName) => {
    const state = this.getStoreState();
    const message = {
      userId: state.app.user.id,
      channelId: state.sidebar.selectedChannel.id,
      text: event.target.value,
    };
    window.socket.emit(eventName, message);
    event.target.value = "";
    this.dispatch(ResetTextAreaHeight(textAreaName));
  };

app.js:
====== 

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
    socket.to(channelId).emit("message", createdMessage); // this line broadcasts the message to every client in the channel
  });

socketChannel.js:
================

clients receive message from the server
window.socket.on("message", async (incomingMessage) => {
  const message = new Message(incomingMessage);
  if (store.state.sidebar.selectedChannel.id === message.channelId) {
    store.dispatch(AddIncomingMessage(message));
  } else {
    const count = store.state.app.user.unreadMessages[message.channelId];
    let incomingUser;
    if (count === undefined) {
      incomingUser = await setUnreadMessages(message.channelId, 1);
    } else {
      incomingUser = await setUnreadMessages(message.channelId, count + 1);
    }
    const user = User(incomingUser);
    store.dispatch(SetUser(user));
  }
});

Here, the client checks if the message is for the currently selected channel. If not, it updates the unread messages count:
It increments the unread messages count for the channel the message belongs to.
Calls setUnreadMessages to update this count on the server.

usersApi.js:
===========

The client makes an API call to update unread messages:
const setUnreadMessages = async (channelId, unreadMessages) => {
  const req = Request("PUT", { unreadMessages });
  const res = await fetch(
    `/api/v1/channels/${channelId}/set-unread-messages`,
    req
  );

  return res.json();
};

ChannelRoutes.js:
================

router.put(
  "/api/v1/channels/:channelId/set-unread-messages",
  isLoggedIn,
  catchError(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.session;
    const { unreadMessages } = req.body;
    try {
      const user = await userService.setUnreadMessages(
        userId,
        channelId,
        unreadMessages
      );
      res.json(new CurrentUserView(user));
    } catch (error) {
      res.status(500).json({ error: "Failed to update unread messages" });
    }
  })
);

UserService.js:
==============

  setUnreadMessages = async (userId, channelId, unreadMessages) => {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // If unreadMessages is a Map:
    if (user.unreadMessages instanceof Map) {
      user.unreadMessages.set(channelId, unreadMessages);
    } else {
      // If unreadMessages is an Object:
      user.unreadMessages[channelId] = unreadMessages;
    }

    return user.save();
  };

