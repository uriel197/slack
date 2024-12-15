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
    // console.log(this.children);
  };
}

module.exports = Component;

/*
    ==================================
       COMMENTS - COMMENTS - COMMENTS
    ==================================

*** Explanations/Component

*/
