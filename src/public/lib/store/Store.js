class Store {
  constructor() {
    this.state = {};
    this.reducers = {};
    this.subscribers = {};
    // this.setReducer = this.setReducer.bind(this);
    // this.setSubscriber = this.setSubscriber.bind(this);
    // this.dispatch = this.dispatch.bind(this);
  }

  setSubscriber = (name, subscriber) => {
    this.subscribers[name] = subscriber;
  };

  //   setSubscriber(name, subscriber) {
  //     this.subscribers[name] = subscriber;
  //   }

  setReducer = (name, reducer, initState = {}) => {
    this.state[name] = initState;
    this.reducers[name] = reducer;
  };

  //   setReducer(name, reducer, initState = {}) {
  //     this.state[name] = initState;
  //     this.reducers[name] = reducer;
  //   }
  dispatch = (action) => {
    // Dispatch is like raising your hand to announce something important happened.
    let newState = {};
    //reducerName: Name of the reducer (e.g., "chat").
    //reducer: The actual reducer function (e.g., chatReducer()).
    for (const [reducerName, reducer] of Object.entries(this.reducers)) {
      console.log(this.reducers); //{sidebar: ƒ} reducerName = sidebar, reducer = (e,s)=> {…}
      const currentState = this.state[reducerName];
      // currentState Refers to the state before the current action is processed. It’s specific to a single reducer.
      newState[reducerName] = reducer(currentState, action);
      //newState Refers to the updated state returned by the reducer for the current action.
      this.state[reducerName] = { ...currentState, ...newState[reducerName] };
      // this.state: is the global state object in the Store.
    }
    for (const subscriber of Object.values(this.subscribers)) {
      subscriber(this.state, action);
      // Subscribers Are Notified After updating the state, the Store calls every subscriber function in this.subscribers
    }
  };
}
//   dispatch(action) {
//     let newState = {};
//     const reducerNames = Object.keys(this.reducers);
//     for (const reducerName of reducerNames) {
//       const currentState = this.state[reducerName];
//       newState = this.reducers[reducerName](currentState, action);
//       this.state[reducerName] = Object.assign({}, currentState, newState);
//     }
//     const subscriberNames = Object.keys(this.subscribers);
//     for (const subscriberName of subscriberNames) {
//       const onEvent = this.subscribers[subscriberName];
//       if (onEvent) {
//         onEvent(this.state, action);
//       }
//     }
//   }

module.exports = Store;

/*
    ==========================================
            COMMENTS - COMMENTS - COMMENTS
    ==========================================

    blocks commented out show how the author wrote the code in 2018 before the introduction of arrow functions. An explanation on how arrow functions and regular functions bind "this" is found in:

    Explanations/Store.this.

State, Action and Subscriber explained in 
Explanations/Store



*/
