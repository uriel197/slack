const Component = require("../component");
const ChatMenu = require("./ChatMenu");
class ChatListItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    this.setChild(
      `menu-${this.props.message.id}`,
      new ChatMenu({ messageId: this.props.message.id })
    );
    return `
      <li data-message="${this.props.message.id}" class="chat__li">
        <div>
          <div class="chat__img"></div>
        </div>
        <div class="chat__li-content">
          <div>
            <span class="chat__username">${this.props.message.username}</span>
            <span class="chat__date">${this.props.message.createdAt}</span>
          </div>
          <div data-js="text-${this.props.message.id}" class="chat__text">${this.props.message.text}</div>
        </div>
        <template data-child="menu-${this.props.message.id}"></template>
      </li>
    `;
  }
}

module.exports = ChatListItem;
