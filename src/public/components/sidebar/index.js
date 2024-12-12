const createElement = require("../../lib/createElement");
const ChannelsList = require("./ChannelsList");
const DirectMessagesList = require("./DirectMessagesList");
const store = require("../../lib/store");
const { SetChannels, SetSelectedChannel } = require("./sidebarActions");
const { getChannels } = require("../../lib/api/channelsApi");

(async () => {
  const createChannelButton = document.querySelector("[data-js=channels]"); // X button
  const createDirectMessageButton = document.querySelector(
    "[data-js=direct-messages]"
  ); // X button
  const channelsList = document.querySelector("[data-js=channels-list]");
  const directMessagesList = document.querySelector(
    "[data-js=direct-messages-list]"
  );
  createDirectMessageButton.addEventListener("click", (event) => {
    alert("Show create direct message modal");
  });
  createChannelButton.addEventListener("click", (event) => {
    alert("Show create channel modal");
  });
  const channels = await getChannels(); /* 2 */

  store.dispatch(SetChannels(channels));
  const lastVisitedChannel = store.state.app.user.lastVisitedChannel;
  const selectedChannel = channels.find(
    (channel) => channel.name === lastVisitedChannel
  );
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

***2: If the application has already been run at least once, the channel (_id, name, usersInChannel, and __v) has already been created by Mongoose, specifically through the createChannel method defined in ChannelService.js. otherwise:

Frontend createChannel
the call to 
"const generalChannel = await createChannel("general");" is refering to the function in channelsApi.js:

const createChannel = async (name) => {
  const req = Request("POST", { name });
  const res = await fetch("/api/v1/channels", req);
  return res.json();
};
This function is a client-side utility to send a POST request to the backend API.
the backend's /api/v1/channels endpoint in app.js with the channel name in the payload receives this request:
app.post(
  "/api/v1/channels",
  catchError(async (req, res) => {
    const { name } = req.body;
    const channel = await channelService.createChannel(name);
    res.json(channel);
  })
);

This listens for a POST request and calls the channelService.createChannel function to handle the logic for creating a new channel.
Backend Service Logic

const createChannel = async (name) => {
  const newChannel = new Channel({ name });
  return await newChannel.save();
};
The channelService.createChannel Uses the Mongoose schema defined in channelModel to create a new instance of a channel:

const channel = new mongoose.Schema({
  name: { type: String, required: true },
  usersInChannel: { type: Array, default: [] },
});
Saves it to the MongoDB database via newChannel.save().
When saved, Mongoose automatically adds fields like _id and __v to the created document. The returned object is sent back to the client as the response.

Backend Response

The backend sends the newly created channel object as JSON:

{
  "_id": "6758a77857c1af50b945ad8e",
  "name": "general",
  "usersInChannel": [],
  "__v": 0
}

Frontend Response Handling
The channels array is then set to include only the generalChannel:

channels = [generalChannel];
This is equivalent to:

channels = [
    {
        "_id": "6758a77857c1af50b945ad8e",
        "name": "general",
        "usersInChannel": [],
        "__v": 0
    }
];

*/
