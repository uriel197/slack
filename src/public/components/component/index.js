const createElement = require("../../lib/createElement");
const store = require("../../lib/store");
class Component {
  constructor(props = {}) {
    this.refs = {};
    this.state = {};
    this.props = props;
    this.children = {};
    this.dispatch = store.dispatch; // No need to bind due to arrow functions
  }

  getStoreState = () => store.state;

  setReducer = (name, reducer, initState = {}) => {
    store.setReducer(name, reducer, initState);
  };

  setSubscriber = (name, subscriber) => {
    store.setSubscriber(name, subscriber);
  };

  setChild = (name, child) => {
    this.children[name] = createElement(child);
    console.log(this.children);
  };
}

module.exports = Component;

/*
    ==================================
       COMMENTS - COMMENTS - COMMENTS
    ==================================

Imagine a LEGO Set
Each Component is like a piece of LEGO. It has specific instructions (methods) and can connect to other LEGO pieces (child components).
The Store is like the manual or rulebook that tells all the LEGO pieces how to work together.
The createElement tool is like the glue that helps turn your LEGO instructions into actual structures you can see and play with (the HTML on your webpage).
The Component Class
The Component class is like the "blueprint" for building each LEGO piece (component). Here's what it does:

Takes Information (Props)
When you build a LEGO piece, you might need extra information to decide how it looks. For example, a LEGO car might need a color or number of wheels.

This information is called props in programming.
In the code, props are stored in this.props.
Manages Its Own Small Details (State)
Each LEGO piece might have small moving parts, like wheels that turn. The piece needs to remember how those parts should behave.

This is like the state, which keeps track of little changes inside the component.
Stored in this.state.
Works with Other Pieces (Children)
Some LEGO pieces are built by combining smaller pieces (like adding wheels to a car).

These smaller pieces are the children stored in this.children.
The setChild method lets a component know which children it has.
Listens to Rules (Store)
If the LEGO set has a rule, like "the car can only move when the wheels are attached," it follows that rule.

The Store manages these rules and shared information for all components.
The Component class connects to the Store using methods like setReducer and setSubscriber.
Updates the World (Dispatch)
When something changes in the LEGO set (like attaching a new wheel), it tells the manual (Store) what happened.

This is done using the dispatch method.
How Component, Store, and createElement Work Together
Store (The Manual):

Keeps track of all the rules (reducers).
Notifies components when something changes (subscribers).
Allows components to update shared information (dispatch).
Component (The LEGO Piece):

Represents an individual part of the project, like a chat box or a button.
Talks to the Store to get or update rules and data.
Combines with other components (children) to build bigger features.
createElement (The Glue):

Converts the LEGO piece's "instructions" (how it should look and behave) into an actual, visible part of the game (HTML elements in your app).
Example: It turns a chat box blueprint into a working chat box you can see on the page.
Real-World Example: A Chat App
Let’s say we’re building a chat app. Here’s how these pieces fit together:

Component Class:

You create a ChatBox component. It has:
props like the username and profile picture.
state for storing the current message being typed.
Store:

Keeps track of all the messages sent in the chat.
When a new message is sent, it tells all chat components to update (subscribers).
createElement:

Takes the ChatBox's instructions and creates an actual chat box on the screen.

*/
