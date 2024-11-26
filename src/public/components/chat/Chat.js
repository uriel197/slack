const Component = require("../component");
const ChatMenu = require("./ChatMenu");
class Chat extends Component {
  constructor(props) {
    /* 1 */
    super(props); // Calls the parent Component constructor
    this.setSubscriber("chat", this.onEvent);
  }
  openThreadAction = (event, postKey) => {
    event.preventDefault();
    alert(postKey);
  };
  openMoreActions = (event, postKey) => {
    event.preventDefault();
    alert(postKey);
  };
  renderPosts = (post, index) => {
    /* 2 */
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
    return `
      <div class="chat__container">
        <ul>
          ${this.props.posts.map(this.renderPosts).join("")}
        </ul>
        <div class="chat__typing">Someone is typing...</div>
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

*/
