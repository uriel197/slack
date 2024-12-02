const Component = require("../component");
const ChatMenu = require("./ChatMenu");
const createElement = require("../../lib/createElement");
const { OpenActionbar } = require("../actionbar/actionbarActions");

// Socket.io Client Setup:
const socketIO = require("socket.io-client");
const socket = socketIO();
const LINE_HEIGHT_IN_PIXELS = 14;
const TEXT_AREA_MAX_HEIGHT = 200;
const RETURN_KEY = 13;
const BACKSPACE_KEY = 8;

class Chat extends Component {
  constructor(props) {
    /* 1 */
    super(props); // Calls the parent Component constructor
    this.setSubscriber("chat", this.onEvent);
  }
  postMessage = (event) => {
    event.preventDefault();
    if (event.keyCode === RETURN_KEY && !event.shiftKey) {
      const message = event.target.value;
      event.target.value = "";
      // client-to-server event.
      socket.emit("message", message);
      // message height is reset
      document.body.style.setProperty("--message-height", 0); /* 4 */
      // The explicit check for !event.shiftKey in the first case ensures that the message is only sent if Enter is pressed without Shift.
    } else if (event.keyCode === RETURN_KEY) {
      const heightString =
        document.body.style.getPropertyValue("--message-height");
      const height = parseInt(heightString || 0);
      const newHeight = Math.min(
        TEXT_AREA_MAX_HEIGHT,
        height + LINE_HEIGHT_IN_PIXELS
      );
      document.body.style.setProperty("--message-height", newHeight);
      // If the user uses Backspace with an empty input, the height resets to zero
    } else if (
      event.keyCode === BACKSPACE_KEY &&
      event.target.value.length < 1
    ) {
      document.body.style.setProperty("--message-height", 0);
    }
  };

  openThreadAction = (event, postKey) => {
    event.preventDefault();
    const title = "Thread";
    const data = { title, component: createElement(window.thread) };
    this.dispatch(OpenActionbar(data));
  };

  openMoreActions = (event, postKey) => {
    event.preventDefault();
    alert(postKey);
  };

  renderPosts = (post, index) => {
    this.setChild(`menu-${index}`, new ChatMenu({ postKey: index }));
    return `
      <li class="chat__li">
        <div>
          <img class="chat__img" src="${post.imageUrl}" />
        </div>
        <div>
          <div>
            <span class="chat__username">${post.username}</span>
            <span class="chat__date">${post.createdAt}</span>
          </div>
          <div class="chat__text">${post.text}</div>
        </div>
        <template data-child="menu-${index}"></template>
      </li>
    `;
  };

  onEvent = (state, action) => {};

  render = () => {
    /* 3 */
    return `
      <div class="chat__container">
        <div data-ref="text" class="chat__text-container">
          <ul>
            ${this.props.posts.map(this.renderPosts).join("")}
          </ul>
          <div class="chat__typing">Someone is typing...</div>
        </div> 
        <div class="chat__input-container">
          <textarea onkeyup="chat.postMessage(event)" class="chat__input" placeholder="Message"></textarea>
        </div>
      </div>
    `;
  };
}
module.exports = Chat;

/*

    ==========================================
            COMMENTS - COMMENTS
    ==========================================

***1: How props are Defined
When you create a new instance of Chat, you pass an object as the props argument. For example when we call it in Chat index.js:
const chat = new Chat({ posts });

In this case, props.posts contains an array of chat posts.
Each post in the array is an object with details like username, text, imageUrl, and createdAt.
then, The map() method is called on this.props.posts to transform each post object into an HTML string by calling this.renderPosts which is the callback passed to the map function.

Joining the HTML Strings:
map() returns an array of HTML strings.
.join("") combines them into a single string of HTML without any separators.

<li>Post 1 content...</li><li>Post 2 content...</li>

Final Markup:
The final HTML combines:
A <div> container for the chat.
A <ul> containing all the chat posts.
A <div> showing a "typing" indicator.


***2: Explanation of renderPosts Method
The renderPosts method in the Chat component is responsible for rendering each post in the chat. Here's a detailed explanation:
1. Arguments
post: An object containing information about a specific post (e.g., username, createdAt, text, and imageUrl).
index: The position of the post in the array of posts.

2. this.setChild
this.setChild(`menu-${index}`, new ChatMenu({ postKey: index }));

Registers a new child component (an instance of ChatMenu) to the current Chat component.
The child component is stored in this.children under the key menu-${index}.
The ChatMenu component is initialized with a prop postKey (set to index), which uniquely identifies the post. The ChatMenu represents a menu (e.g., actions) associated with each chat post. By using setChild, the menu component is properly linked to the chat and can be rendered dynamically.

Menu Placeholder:
<template data-child="menu-${index}"></template>: A placeholder for the ChatMenu component.
This is where the child component (ChatMenu) will be dynamically inserted by the createElement utility.

*** 3: onkeyup="chat.postMessage(event)"
    This is the event listener attached to the textarea. It triggers the postMessage method every time the user types (i.e., the key is released). The method handles the message formatting, height adjustment, and emits the message if Enter is pressed.

***4: document.body.style.setProperty("--message-height", 0);
    is used to update a CSS custom property called --message-height defined in chat.css.
    The --message-height custom property is used to control the height of the text input area for the chat.
    When the user presses Enter (without Shift), this line resets the --message-height variable to 0. This likely means the height of the text area will be reset to its default (possibly no extra space).
    The value of --message-height might be used in the CSS to dynamically adjust the height of the text input area, or potentially other elements that are dependent on this value.

*/
