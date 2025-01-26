const Component = require("../component");
const ChatListItem = require("./ChatListItem");
const createElement = require("../../lib/createElement");
const {
  SET_TYPING_USER,
  RESET_TYPING_USERS,
  ADD_MESSAGE,
  SCROLL_TO_BOTTOM,
  INCOMING_UPDATE_MESSAGE,
  SET_MESSAGES,
  INCOMING_DELETE_MESSAGE,
  DELETE_MESSAGE,
  ADD_INCOMING_MESSAGE,
} = require("./chatEvents");
const { updateMessage, deleteMessage } = require("../../lib/api/chatApi");
const EditText = require("./components/editText/EditText");
const MessageMenu = require("./components/messageMenu/MessageMenu");
const Message = require("./Message");
const Thread = require("../actionbar/components/thread/Thread");
const { UpdateMessage, DeleteMessage } = require("./chatActions");
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

  saveUpdatedMessage = async (event, messageId) => {
    event.preventDefault();
    const element = this.refs.messages.querySelector(
      `[data-js=edit-text-area]`
    );
    const incomingMessage = await updateMessage(messageId, element.value);
    const message = Message(incomingMessage);
    this.dispatch(UpdateMessage(message));
    window.socket.emit("update-message", message.id);
    this.cancelEdit(event, messageId);
  };

  cancelEdit = (event, messageId) => {
    event.preventDefault();
    const element = this.refs.messages.querySelector(`[data-js=edit-text]`);
    const message = this.getStoreState().chat.messages.find(
      (message) => message.id === messageId
    );
    const component = new ChatListItem({
      message,
    });
    const node = createElement(component);
    const textElement = node.querySelector(`[data-js=text-${messageId}]`);
    element.parentNode.replaceChild(textElement, element);
    document.body.style.setProperty("--edit-message-height", 0);
  };

  setEditMessage = (event, messageId) => {
    event.preventDefault();
    const element = this.refs.messages.querySelector(
      `[data-js=text-${messageId}]`
    );
    const item = this.getStoreState().chat.messages.find(
      (message) => message.id === messageId
    );
    const text = item.text.replace(/<br\/>/g, "\n");
    text
      .split("")
      .filter((item) => item === "\n")
      .forEach(() => {
        this._createNewRow("--edit-message-height");
      });
    const node = createElement(new EditText({ text, messageId }));
    element.parentNode.replaceChild(node, element);
    const textarea = node.querySelector(`[data-js=edit-text-area]`);
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  };

  editMessage = async (event, messageId) => {
    event.preventDefault();
    if (event.keyCode === RETURN_KEY && !event.shiftKey) {
      await this.saveUpdatedMessage(event, messageId);
    } else if (event.keyCode === RETURN_KEY) {
      this._createNewRow("--edit-message-height");
    }
    if (event.target.value.length < 1) {
      document.body.style.setProperty("--edit-message-height", 0);
    }
  };

  deleteMessage = async (event, messageId) => {
    event.preventDefault();
    try {
      const incoming = await deleteMessage(messageId); // API
      const message = Message(incoming);
      this.dispatch(DeleteMessage(message));
      window.socket.emit("delete-message", message);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  postMessage = (event) => {
    event.preventDefault();
    if (event.keyCode === RETURN_KEY && !event.shiftKey) {
      // The explicit check for !event.shiftKey in the first case ensures that the message is only sent if Enter is pressed without Shift.

      this._sendMessage(event, "message", "--message-height");
    } else if (event.keyCode === RETURN_KEY) {
      this._createNewRow("--message-height");
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

  _createNewRow = (varname) => {
    const heightString = document.body.style.getPropertyValue(varname);
    const height = parseInt(heightString || 0);
    const newHeight = Math.min(
      TEXT_AREA_MAX_HEIGHT,
      height + LINE_HEIGHT_IN_PIXELS
    );
    document.body.style.setProperty(varname, newHeight);
  };

  _sendMessage = (event, eventName, varname) => {
    const state = this.getStoreState();
    const message = {
      userId: state.app.user.id,
      channelId: state.sidebar.selectedChannel.id,
      text: event.target.value,
    };
    window.socket.emit(eventName, message);
    event.target.value = "";
    document.body.style.setProperty(varname, 0);
  };

  openThreadAction = (event) => {
    event.preventDefault();
    const title = "Thread";
    window.thread = new Thread();
    const data = { title, component: createElement(window.thread) };
    this.dispatch(OpenActionbar(data));
  };

  closeMessageMenu(event) {
    event.preventDefault();
    this.state.messageMenu.remove();
  }

  openMoreActions = (event, messageId) => {
    event.preventDefault();
    const targetDimensions = event.target.getBoundingClientRect();
    const targetX = targetDimensions.x;
    const targetY = targetDimensions.y;
    const username = this.getStoreState().chat.messages.find(
      (message) => message.id === messageId
    ).username;
    const renderElements = username === this.getStoreState().app.user.username;
    const component = new MessageMenu({ renderElements, messageId });
    const node = createElement(component);
    this.state.messageMenu = node;
    document.body.appendChild(this.state.messageMenu);
    const menu = this.state.messageMenu.querySelector("[data-js=menu]");
    const menuDimensions = menu.getBoundingClientRect();
    const menuX = targetX - menuDimensions.width;
    const menuY = targetY;
    menu.style.top = `${menuY}px`;
    menu.style.left = `${menuX}px`;
  };

  renderMessage = (message, index) => {
    this.setChild(`${index}`, new ChatListItem({ message }));
    return `<template data-child="${index}"></template>`;
  };

  // onEvent in Explanations/ChatReducer-onEvent
  onEvent = async (state, action) => {
    if (action.type === INCOMING_DELETE_MESSAGE) {
      const messageId = action.value;
      const node = Array.from(this.refs.messages.childNodes).find(
        (el) => el.getAttribute("data-message") === messageId
      );
      if (node) node.remove();
    }

    if (action.type === DELETE_MESSAGE) {
      const messageId = action.value.id;
      const node = Array.from(this.refs.messages.childNodes).find(
        (el) => el.getAttribute("data-message") === messageId
      );
      if (node) node.remove();
    }

    if (action.type === SET_MESSAGES) {
      Array.from(this.refs.messages.childNodes).forEach((el) => el.remove());
      state.chat.messages.forEach((message) => {
        const messageElement = new ChatListItem({ message });
        this.refs.messages.appendChild(createElement(messageElement));
      });
    }

    if (action.type === INCOMING_UPDATE_MESSAGE) {
      const messageElement = this.refs.messages.querySelector(
        `[data-message="${action.value.id}"]`
      );
      const index = state.chat.messages
        .map((message) => message.id)
        .indexOf(action.value.id);
      const newElement = new ChatListItem({
        message: action.value,
      });
      messageElement.parentNode.replaceChild(
        createElement(newElement),
        messageElement
      );
    }

    if (action.type === ADD_MESSAGE || action.type === ADD_INCOMING_MESSAGE) {
      const index = state.chat.messages.length - 1;
      const message = state.chat.messages[index];
      const messageElement = new ChatListItem({ message });
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
