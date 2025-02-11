const Component = require("../../../component");
const { SET_USER } = require("../../../app/appEvents");

class DirectMessagesList extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber(
      `directMessageListItem-${this.props.channel.id}`,
      this.onEvent
    );
  }

  onEvent = (state, action) => {
    if (action.type === SET_USER) {
      const count =
        (action.value.unreadMessages || {})[this.props.channel.id] || 0;
      this.refs.unreadMessages.textContent = count >= 99 ? "99+" : count;
      this.refs.unreadMessages.style.display = count > 0 ? "inline" : "none";
      this.refs.times.style.display = count > 0 ? "none" : "initial";
    }
  };

  onCreated() {
    const count =
      (this.getStoreState().app.user.unreadMessages || {})[
        this.props.channel.id
      ] || 0;
    this.refs.unreadMessages.style.display = count > 0 ? "inline" : "none";
    this.refs.times.style.display = count > 0 ? "none" : "initial";
  }

  render = () => {
    const { id, name } = this.props.channel || {};
    const count =
      this.getStoreState().app.user.unreadMessages[this.props.channel.id];
    let displayCount = count >= 99 ? "99+" : count;
    if (!id || !name) {
      console.log("DirectMessageListItem: no id or name");
      return "";
    }

    return `
      <li class="sidebar__li" data-channel="${this.props.channel.id}">
        <a href="#/channels/${this.props.channel.id}" class="sidebar__direct-message-link">
          <span>
            <span>
              <span class="sidebar__dot"></span>
              ${this.props.channel.name}
            </span>
          </span>
          <span data-ref="unreadMessages" class="sidebar__unread">${displayCount}</span>
          <button data-ref="times" onclick="directMessagesList.leaveChannel(event, '${this.props.channel.id}')" class="sidebar__times">&times;</button>
        </a>
      </li>
    `;
  };
}

module.exports = DirectMessagesList;
