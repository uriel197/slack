const Component = require("../../../component");
const { SET_USER } = require("../../../app/appEvents");

class ChannelListItem extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber(
      `channelListItem-${this.props.channel.id}`,
      this.onEvent
    );
  }
  onEvent = (state, action) => {
    if (action.type === SET_USER) {
      const count =
        (action.value.unreadMessages || {})[this.props.channel.id] || 0;
      this.refs.unreadMessages.textContent = count >= 99 ? "99+" : count;
      if (this.refs.unreadMessages) {
        this.refs.unreadMessages.style.display = count > 0 ? "inline" : "none";
      }
    }
  };

  onCreated = () => {
    const count =
      (this.getStoreState().app.user.unreadMessages || {})[
        this.props.channel.id
      ] || 0;
    if (!count) {
      this.refs.unreadMessages.style.display = "none";
    }
  };

  render = () => {
    const { id, name } = this.props.channel || {};
    if (!id || !name) return "";
    const count =
      this.getStoreState().app.user.unreadMessages[this.props.channel.id];
    const displayCount = count >= 99 ? "99+" : count;
    return `
    <li data-channel="${this.props.channel.id}" class="sidebar__li">
      <a href="#/channels/${this.props.channel.id}" class="sidebar__link">
        <span>
          <span class="sidebar__hash">#</span>
          ${this.props.channel.name}
        </span>
        <span data-ref="unreadMessages" class="sidebar__unread">${displayCount}</span>
      </a>
    </li>
  `;
  };
}

module.exports = ChannelListItem;
