const Component = require("../component");
const { SetSelectedChannel } = require("./sidebarActions");
const { SET_SELECTED_CHANNEL } = require("./sidebarEvents");
class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber("channelList", this.onEvent);
  }
  onEvent = (state, action) => {
    /* 1 */
    if (action.type === SET_SELECTED_CHANNEL) {
      const refs = Object.values(this.refs);
      console.log(this.refs); // {general: li.sidebar__li.sidebar__li--selected, foo: li.sidebar__li}

      refs.forEach((ref) => {
        ref.classList.remove("sidebar__li");
        ref.classList.remove("sidebar__li--selected");
        ref.classList.add("sidebar__li");
      });
    }
  };

  // on clicking the channel
  loadChannel = (event, channelName) => {
    event.preventDefault();
    const channel = this.getStoreState().sidebar.channels.find(
      (channel) => channel.name === channelName
    );
    this.dispatch(SetSelectedChannel(channel));
    this.refs[channelName].classList.add("sidebar__li--selected");
  };

  renderListItem = ({ selected, name }) => {
    const className = selected ? "sidebar__li--selected" : "sidebar__li";
    return `
      <li data-ref="${name}" class="${className}">
        <a onclick="channelsList.loadChannel(event, '${name}')" class="sidebar__link">
          <span class="sidebar__hash">#</span> ${name}
        </a>
      </li>
    `;
  };
  render = () => {
    console.log(this.props);
    // channels: Array(2)
    // 0: {channelName: 'general'}
    // 1: {channelName: 'foo'}

    return `
      <ul class="sidebar__list">
         ${this.getStoreState()
           .sidebar.channels.map(this.renderListItem)
           .join("")}
      </ul>
    `;
  };
}

module.exports = ChannelList;

/*
    =======================================
        COMMENTS - COMMENTS - COMMENTS
    =======================================

*** 1: How the methods Work Together:

onEvent Method: Reacts to changes in the application's state, resetting the classes for all channels when a new channel is selected.

onClick Event: Triggers the loadChannel method, which updates the state by dispatching the SetSelectedChannel action and visually marks the clicked channel as selected.

Here’s a quick summary of their interaction:

User clicks a channel: onClick triggers loadChannel.

loadChannel Dispatches Action: SetSelectedChannel action is dispatched to update the selected channel in the store.

Store Updates: The store’s state changes, triggering subscribers.

onEvent Handles State Change: onEvent method resets the channel classes to ensure only the selected channel is highlighted.

*/
