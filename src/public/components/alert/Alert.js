const Component = require("../component");
const { SHOW_ALERT, CLOSE_ALERT } = require("./alertEvents");
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
      this.refs.title.textContent = action.value.title;
      const child = this.refs.content.firstChild;
      this.refs.content.replaceChild(action.value.component, child);
      this.refs.alert.classList.add("alert--show");
    } else if (action.type === CLOSE_ALERT) {
      this.refs.alert.classList.remove("alert--show");
    }
  };

  render = () => {
    return `
      <div data-ref="alert" class="alert">
        <header class="alert__header">
          <button class="alert__button" onclick="alertModal.close()">
            <div class="alert__times">&times;</div>
            esc
          </button>
        </header>
        <div class="alert__content-container">
          <h1 data-ref="title"></h1>
          <div data-ref="content"> </div>
        </div>
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
