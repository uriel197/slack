const Component = require("../component");
const ChatListItem = require("./ChatListItem");
const createElement = require("../../lib/createElement");
const {
  SET_TYPING_USER,
  RESET_TYPING_USERS,
  ADD_MESSAGE,
  SCROLL_TO_BOTTOM,
  SET_MESSAGES,
  ADD_INCOMING_MESSAGE,
} = require("./chatEvents");
const { OpenActionbar } = require("../actionbar/actionbarActions");

// styles variables
const LINE_HEIGHT_IN_PIXELS = 14;
const TEXT_AREA_MAX_HEIGHT = 200;
const RETURN_KEY = 13;

class Chat extends Component {
  constructor(props) {
    /* 1 */
    super(props); // Calls the parent Component constructor
    this.setSubscriber("chat", this.onEvent);
  }

  postMessage = (event) => {
    event.preventDefault();
    if (event.keyCode === RETURN_KEY && !event.shiftKey) {
      // The explicit check for !event.shiftKey in the first case ensures that the message is only sent if Enter is pressed without Shift.
      this._sendMessage(event);
    } else if (event.keyCode === RETURN_KEY) {
      this._createNewRow();
    }
    const user = this.getStoreState().app.user.username;
    const channelId = this.getStoreState().sidebar.selectedChannel.id;

    if (event.target.value.length < 1) {
      document.body.style.setProperty("--message-height", 0);
      window.socket.emit("stopped-typing", { channelId, user });
    } else if (event.target.value.length > 0) {
      window.socket.emit("started-typing", { channelId, user });
    }
  };

  _createNewRow = () => {
    const heightString =
      document.body.style.getPropertyValue("--message-height");
    const height = parseInt(heightString || 0);
    const newHeight = Math.min(
      TEXT_AREA_MAX_HEIGHT,
      height + LINE_HEIGHT_IN_PIXELS
    );
    document.body.style.setProperty("--message-height", newHeight);
  };

  _sendMessage = (event) => {
    const state = this.getStoreState();
    const message = {
      userId: state.app.user.id,
      channelId: state.sidebar.selectedChannel.id,
      text: event.target.value,
    };
    window.socket.emit("message", message);
    event.target.value = "";
    document.body.style.setProperty("--message-height", 0);
  };

  openThreadAction = (event) => {
    event.preventDefault();
    const title = "Thread";
    const data = { title, component: createElement(window.thread) };
    this.dispatch(OpenActionbar(data));
  };

  openMoreActions = (event, key) => {
    event.preventDefault();
    alert(key);
  };

  renderMessage = (message, index) => {
    this.setChild(`item-${index}`, new ChatListItem({ message, key: index }));
    return `<template data-child="item-${index}"></template>`;
  };

  // onEvent in Explanations/ChatReducer-onEvent
  onEvent = async (state, action) => {
    if (action.type === SET_MESSAGES) {
      Array.from(this.refs.messages.childNodes).forEach((el) => el.remove());
      state.chat.messages.forEach((message, index) => {
        const messageElement = new ChatListItem({ message, key: index });
        this.refs.messages.appendChild(createElement(messageElement));
      });
    }

    if (action.type === ADD_MESSAGE || action.type === ADD_INCOMING_MESSAGE) {
      const index = state.chat.messages.length - 1;
      const message = state.chat.messages[index];
      const messageElement = new ChatListItem({ message, key: index });
      this.refs.messages.appendChild(createElement(messageElement));
    }
    const scrollTypes = [ADD_MESSAGE, SCROLL_TO_BOTTOM];
    if (scrollTypes.includes(action.type)) {
      this.refs.text.scrollTop = this.refs.text.scrollHeight;
    }
    const typingTypes = [SET_TYPING_USER, RESET_TYPING_USERS];
    if (typingTypes.includes(action.type)) {
      const users = Object.keys(state.chat.typingUsers);
      const typingUsers = users.filter(
        (user) => !!state.chat.typingUsers[user]
      ); /* 3 */
      if (typingUsers.length > 1) {
        this.refs.typing.textContent = "Several people are typing...";
      } else if (typingUsers.length === 1) {
        this.refs.typing.textContent = `${typingUsers[0]} is typing...`;
      } else {
        this.refs.typing.textContent = "";
      }
    }
  };

  render = () => {
    /* 3 */
    return `
      <div class="chat__container">
        <div data-ref="text" class="chat__text-container">
          <ul data-ref="messages">
            ${this.getStoreState()
              .chat.messages.map(this.renderMessage)
              .join("")}
          </ul>
          <div data-ref="typing" class="chat__typing"></div>
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

*** 1: Explanations/Chat.***1

*** 2: Explanations/Chat.***2

*** 3: The double exclamation marks (!!) are used in JavaScript to convert a value into its boolean equivalent. Here's what it does step-by-step:

First Exclamation Mark (!): Converts the value into its opposite boolean form.

Truthy values become false.
Falsy values become true.
Second Exclamation Mark (!!): Negates the result of the first !, effectively converting the value back into a boolean.

Ensures that the result is strictly true or false.
Why Use !! in the Code?

const typingUsers = users.filter(user => !!state.chat.typingUsers[user]);
In this case:

state.chat.typingUsers[user]:
This accesses the typingUsers object to check if the current user is typing.
The value could be undefined, null, or another falsy value if the user isn't typing, in that case user would be undefined or null, then:
!!state.chat.typingUsers[user]:
the first "!" negates the value which in this case is undefined and "!undefined === true".
the second "!" negates the first "!" from true to false, therefore, in the case of user being undefined:
!!state.chat.typingUsers[user] = false

That way we ensure that the value is converted into true or false, regardless of its original type.


*/
