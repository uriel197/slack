const Component = require("../../../component");
const UserListItem = require("./UserListItem");
const { FilterDirectMessages, CloseAlert } = require("../../alertActions");
const { FILTER_DIRECT_MESSAGES } = require("../../alertEvents");
const Channel = require("../../../sidebar/Channel");
const { createChannel } = require("../../../../lib/api/channelsApi");

class AlertDirectMessageList extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber("alertDirectMessagesList", this.onEvent);
  }

  filterUsers = (event) => {
    event.preventDefault();
    const text = event.target.value;
    this.dispatch(FilterDirectMessages(text));
  };

  sendDirectMessage = async (event, userToMessageId, userToMessageName) => {
    event.preventDefault();
    const currentUser = this.getStoreState().app.user;
    const incomingChannel = await createChannel(
      `${currentUser.username},${userToMessageName}`,
      [currentUser.id, userToMessageId],
      "directMessage"
    );
    const channel = Channel(incomingChannel, currentUser);
    window.socket.emit("first-direct-message", {
      userId: userToMessageId,
      channelId: channel.id,
    });
    this.dispatch(CloseAlert());
    window.location.hash = `#/channels/${channel.id}`;
  };

  onEvent = (state, action) => {
    if (action.type === FILTER_DIRECT_MESSAGES) {
      const items = Object.values(this.refs.userList.childNodes);
      console.log(items);
      // 0: li.alert__user-list-item
      // 1: li.alert__user-list-item.alert__li--hide
      // 2: li.alert__user-list-item.alert__li--hide

      const regex = new RegExp(`^${action.value}`); // action.value = text, The regex will match any string that starts with the characters being typed.
      items.forEach((element) => {
        element.classList.remove("alert__li--hide");
        if (!regex.test(element.getAttribute("data-username"))) {
          // .test() is a built-in method in JavaScript's RegExp object. It is used to check if a regular expression matches a string. it checks if the string starts with the letters being typed.
          element.classList.add("alert__li--hide");
        }
      });
    }
  };

  renderUser = (user, index) => {
    this.setChild(`item-${index}`, new UserListItem({ user }));
    return `<template data-child="item-${index}"></template>`;
  };

  render = () => {
    return `
      <div>
        <header class="alert__header">
          <button class="alert__button" onclick="alertModal.close()">
            <div class="alert__times">&times;</div>
            esc
          </button>
        </header>
        <div class="alert__content-container">
          <h1>Direct Messages</h1>
          <div class="alert__direct-message-list">
            <form class="alert__direct-message-form">
              <input onkeyup="alertDirectMessageList.filterUsers(event)" class="alert__find-conversation" type="text" placeholder="Find or start a conversation" />
            </form>
            <ul data-ref="userList" class="alert__direct-message-ul">${this.props.users
              .map(this.renderUser)
              .join("")}</ul>
          </div>
        </div>
      </div>
    `;
  };
}

module.exports = AlertDirectMessageList;
