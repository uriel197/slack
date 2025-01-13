const Component = require("../component");
const {
  SHOW_ALERT,
  CLOSE_ALERT,
  SHOW_CREATE_CHANNEL,
} = require("./alertEvents");
const { CloseAlert } = require("./alertActions");

class Alert extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber("alert", this.onEvent);
  }

  close = () => {
    this.dispatch(CloseAlert());
  };

  onEvent = (state, action) => {
    // Explanations/dispatch-noReducers
    if (action.type === SHOW_ALERT) {
      const child = this.refs.content.firstChild;
      this.refs.content.replaceChild(action.value, child);
      this.refs.alert.classList.add("alert--show");
    }
    if (action.type === SHOW_CREATE_CHANNEL) {
      const child = this.refs.content.firstChild;
      this.refs.content.replaceChild(action.value, child);
    }
    if (action.type === CLOSE_ALERT) {
      this.refs.alert.classList.remove("alert--show");
    }
  };

  render = () => {
    return `
      <div data-ref="alert" class="alert">
        <div data-ref="content"> </div>
      </div>
    `;
  };
}

module.exports = Alert;

/*

    ===============================================
            COMMENTS - COMMENTS - COMMENTS
    ===============================================

*** Note on reducers:
The UI updates because the onEvent function listens to relevant actions and directly manipulates the DOM.
A reducer isn't necessary because the alert's state doesn't need to be shared or managed globally beyond triggering SHOW_ALERT or CLOSE_ALERT. The onEvent method takes care of making the necessary changes to the DOM.
reducers are primarily used to manage global state updates that need to be shared across all users of a channel or between different parts of the application.

*/
