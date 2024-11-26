const Component = require("../component");
class ChatMenu extends Component {
  constructor(props) {
    super(props); // Calls the parent Component constructor
  }
  render = () => {
    return `
      <ul class="chat__menu">
        <li onclick="chat.openThreadAction(event, '${this.props.postKey}')" class="chat__menu-li chat__menu-li--chat"></li>
        <li onclick="chat.openMoreActions(event, '${this.props.postKey}')" class="chat__menu-li">&middot;&middot;&middot;</li>
      </ul>
    `;
  };
}
module.exports = ChatMenu;
