module.exports = {
  selectedChannel: {
    name: "",
    id: "",
  },
  channels: [],
};

/*
Purpose of initState.js
Provide Default Values:

It defines the starting values for the state managed by the sidebarReducer.
In this case, the initial state contains a single property, selectedChannel, which is set to an empty string (""). This means that when the app first loads, no channel is selected.

State Initialization:
When you use store.setReducer, this initState is passed to ensure the state for the sidebar is initialized properly in the global state tree.

store.setReducer("sidebar", sidebarReducer, initState);

*/
