const Component = require("../component");
const { CloseActionbar } = require("./actionbarActions");
const { OPEN_ACTIONBAR, CLOSE_ACTIONBAR } = require("./actionbarEvents");
require("./components/thread");
require("./components/file");

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
    if (action.type === OPEN_ACTIONBAR) {
      this.refs.title.textContent = action.value.title;
      const child = this.refs.content.firstChild;
      this.refs.content.replaceChild(action.value.component, child);
      console.log(this.refs); // {actionbar: aside.actionbar, title: h2, content: div};

      this.refs.actionbar.style.display = "initial"; // css class that shows the element on the page
    } else if (action.type === CLOSE_ACTIONBAR) {
      this.refs.actionbar.style.display = "none"; // css class that hides it
    }
  };

  render = () => {
    return `
      <aside data-ref="actionbar" class="actionbar">
        <header class="actionbar__header">
          <h2 data-ref="title">Header</h2>
          <button class="actionbar__close-btn" onclick="actionbar.closeActionbar(event)">&times;</button>
        </header>
        <div data-ref="content"> </div>
      </aside>
    `;
  };
}
module.exports = Actionbar;

/*
        =============================================
            COMMENTS - COMMENTS - COMMENTS
        =============================================

closeActionbar = (event) => {
    event.preventDefault();
    this.dispatch(CloseActionbar());
  };

this.dispatch(CloseActionbar()), Dispatches the CLOSE_ACTIONBAR action using the dispatch method provided by the Component class.
when we require { CloseActionbar } = require("./actionbarActions") we are requiring the following function:

const CloseActionbar = () => {
  return {
    type: CLOSE_ACTIONBAR,
    value: true,
  };
};

This function creates an action object that updates the state to indicate that the action bar should be closed.

value: true means that actionbar is closed by default.

onEvent = (state, action):
when action bar render() method creates an element it updates this.refs and creates 3 refs:
{actionbar: aside.actionbar, title: h2, content: div} which are the elements that contain data-ref attributes.
 then, if (action.type === OPEN_ACTIONBAR) {
    this.refs.title.textContent = action.value.title;
first we need to know, what is the action. in the actionbarActions.js we find that the actions are CloseActionbar and OpenActionbar. we already saw CloseActionbar the following is OpenActionbar:

const OpenActionbar = (value) => {
  return {
    type: OPEN_ACTIONBAR,
    value,
  };
};

notice that the parameter is "value" which is passed in the Chat component:

openThreadAction = (event, postKey) => {
    event.preventDefault();
    const title = "Thread";
    const data = { title, component: createElement(window.thread) };
    this.dispatch(OpenActionbar(data));
  };

so the "value" is data and so action.value.title = Thread

const child = this.refs.content.firstChild:
if you notice you will see that there is a space between the open and closing div tags:
<div data-ref="content"> </div>
that space is a node and that is the content.firstChild which is replaced in the line below for action.value.component which is Thread.render():
    <div class="thread">
        This is a thread
    </div>
this.refs.content.replaceChild(action.value.component, child);

Explanation of initial in CSS:
==============================

The "initial" keyword sets a CSS property to its default value as per the CSS specification.
In the Context of display:

When you use display: initial;, the browser resets the display property to its default value for the type of element.
For example:
<div> elements have a default display of block.
<span> elements have a default display of inline.
Why Use initial?

It’s useful when you want to reset a property without knowing its default value or overriding styles defined elsewhere.

this.refs.actionbar.style.display = "initial";
sets the display property of the actionbar element back to its default (probably block since <aside> elements are block-level elements by default).

This ensures that the actionbar becomes visible (as long as no other CSS rule explicitly hides it, like display: none;).

But wait! you say that this works as long as no other CSS rule explicitly hides it, like display: none, but here is the css for actionbar:
.actionbar {
  display: none;
}

If the .actionbar element has a display: none rule defined in its CSS, setting this.refs.actionbar.style.display = "initial"; will not override this rule unless the inline style takes precedence. Here’s how this works in detail:

CSS Specificity and Precedence
Default State in CSS:

.actionbar starts with display: none; from your CSS, which hides it.
Inline Styles Take Precedence:

When you set this.refs.actionbar.style.display = "initial";, it adds an inline style to the element, like this:

<aside class="actionbar" style="display: initial;"></aside>
Inline styles have higher specificity than styles in a CSS file, so the browser applies display: initial.
Effect of initial:

The initial keyword resets the property to the browser's default for the element:
For <aside>, the default is block.
*/
