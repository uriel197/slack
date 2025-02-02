const Component = require("../component");
const { CloseActionbar } = require("./actionbarActions");
const { OPEN_ACTIONBAR, CLOSE_ACTIONBAR } = require("./actionbarEvents");
const { SCROLL_THREAD_TO_BOTTOM } = require("./components/thread/threadEvents");
const { SetSelectedMessageId } = require("./components/thread/threadActions");
require("./components/thread");

class Actionbar extends Component {
  constructor(props) {
    super(props);
    this.setSubscriber("actionbar", this.onEvent);
  }

  closeActionbar = (event) => {
    event.preventDefault();
    this.dispatch(CloseActionbar());
  };

  onEvent = (state, action) => {
    if (action.type === SCROLL_THREAD_TO_BOTTOM) {
      this.refs.content.scrollTop = this.refs.content.scrollHeight;
    }
    /* 1 */
    if (action.type === OPEN_ACTIONBAR) {
      this.refs.title.textContent = action.value.title;
      const child = this.refs.content.firstChild;
      this.refs.content.replaceChild(action.value.component, child);
      console.log(this.refs); // {actionbar: aside.actionbar, title: h2, content: div};

      this.refs.actionbar.style.display = "initial"; /* 2 */
    } else if (action.type === CLOSE_ACTIONBAR) {
      this.refs.actionbar.style.display = "none";
      this.dispatch(SetSelectedMessageId(""));
    }
  };

  render = () => {
    return `
      <aside data-ref="actionbar" class="actionbar">
        <header class="actionbar__header">
          <h2 data-ref="title">Header</h2>
          <button class="actionbar__close-btn" onclick="actionbar.closeActionbar(event)">&times;</button>
        </header>
        <div class="actionbar__content"  data-ref="content"> </div>
      </aside>
    `;
  };
}
module.exports = Actionbar;

/*
        =============================================
            COMMENTS - COMMENTS - COMMENTS
        =============================================

*** 1: Explanations/Actionbar-flow

*** 2: Explanations/initialCss

*/
