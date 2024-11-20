const Store = require("./Store");
const store = new Store();
window.__STATE__ = store.state;
module.exports = store;

/*
Creates a single store instance.
Exposes the state globally via window.__STATE__ for debugging purposes.
Exports the store instance for use in your application.
*/
