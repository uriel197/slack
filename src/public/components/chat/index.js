const Chat = require("./Chat");
const createElement = require("../../lib/createElement");

const chatElement = document.querySelector("[data-js=chat-text]");
//  Targets the <div> or element in the HTML with the attribute data-js="chat-text" where the chat interface will be rendered.

const chat = new Chat();
window.chat = chat;
const chatNode = createElement(window.chat);
chatElement.parentNode.replaceChild(chatNode, chatElement);
// replaceChild(chatNode, chatElement): Replaces the existing placeholder element (chatElement) with the newly created DOM structure for the chat.

chat.refs.text.scrollTop = chat.refs.text.scrollHeight;

/*
    =======================================
        COMMENTS - COMMENTS - COMMENTS
    =======================================
    
This index.js file in the Chat module is responsible for creating and rendering a chat interface.

*** 2: 
What is scrollTop?
scrollTop is the vertical scroll position of an element.
It tells you how far you have scrolled from the top of the scrollable content.
It is a read-write property, meaning you can use it to:
Read how much has been scrolled.
Set it to scroll the element programmatically.
Example:
If scrollTop = 0, you’re at the top of the element.
If scrollTop = 100, you’ve scrolled 100 pixels down from the top.

What is scrollHeight?
scrollHeight is the total height of the scrollable content inside an element.
Even if the content is larger than the visible area, scrollHeight includes the entire height.

Why Use scrollTop and scrollHeight in Chat?
In a chat application, this behavior is essential for keeping the latest messages in view:

scrollTop = scrollHeight ensures the chat window is always scrolled to the bottom whenever new messages arrive.

*/
