const Chat = require("./Chat");
const Post = require("./Post");
const createElement = require("../../lib/createElement");

const chatElement = document.querySelector("[data-js=chat-text]");
//  Targets the <div> or element in the HTML with the attribute data-js="chat-text" where the chat interface will be rendered.

const incomingPost = {
  imageUrl: "https://ca.slack-edge.com/T0K3BDXT3-U0XHYV6S3-3905df6f4e1e-48",
  username: "Fredrik",
  createdAt: new Date().toISOString(),
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. \n\n Qui ut sequi iusto maxime explicabo a molestiae nam minus quidem quibusdam, quis assumenda tempore laudantium voluptate reiciendis praesentium? Itaque, laborum nostrum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ut sequi iusto maxime explicabo a molestiae nam minus quidem quibusdam, quis assumenda tempore laudantium voluptate reiciendis praesentium? Itaque, laborum nostrum!",
};
const posts = [
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
  Post(incomingPost),
];

const chat = new Chat({ posts });
// Chat: A new instance of the Chat component is created with the formatted posts array passed in as props.

window.chat = chat;
const chatNode = createElement(chat);
chatElement.parentNode.replaceChild(chatNode, chatElement);
// replaceChild(chatNode, chatElement): Replaces the existing placeholder element (chatElement) with the newly created DOM structure for the chat.

chatNode.scrollTop = chatNode.scrollHeight;
// Automatically scrolls the chat window to the bottom so that the latest messages are visible.

/*
    =======================================
        COMMENTS - COMMENTS - COMMENTS
    =======================================
    
This index.js file in the Chat module is responsible for creating and rendering a chat interface.

*/
