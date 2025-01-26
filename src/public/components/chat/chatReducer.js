const {
  SET_TYPING_USER,
  SET_MESSAGES,
  RESET_TYPING_USERS,
  ADD_MESSAGE,
  ADD_INCOMING_MESSAGE,
  DELETE_MESSAGE,
  INCOMING_DELETE_MESSAGE,
  UPDATE_MESSAGE,
} = require("./chatEvents");
module.exports = (state, action) => {
  switch (action.type) {
    case INCOMING_DELETE_MESSAGE: {
      const messages = state.messages.filter(
        (message) => message.id !== action.value
      );
      return Object.assign({}, state, { messages });
    }

    case DELETE_MESSAGE: {
      const messages = state.messages.filter(
        (message) => message.id !== action.value.id
      );
      return Object.assign({}, state, { messages });
    }

    case UPDATE_MESSAGE: {
      const messages = state.messages.map((message) => {
        if (message.id === action.value.id) return action.value;
        return message;
      });
      return Object.assign({}, state, { messages });
    }

    case ADD_INCOMING_MESSAGE: /* 1 */
    case ADD_MESSAGE: {
      const messages = state.messages.concat([action.value]); /* 2 */
      return Object.assign({}, state, { messages });
    }
    case SET_MESSAGES:
      return Object.assign({}, state, { messages: action.value });
    case RESET_TYPING_USERS:
      return Object.assign({}, state, { typingUsers: {} });
    case SET_TYPING_USER: {
      const typingUsers = Object.assign({}, state.typingUsers, {
        [action.value.user]: action.value.isTyping,
      });
      return Object.assign({}, state, { typingUsers });
    }
    default:
      return state;
  }
};

/*
    =================================
      COMMENTS - COMMENTS - COMMENTS
    =================================

*** 1: explanations/ChatReducer-onEvent

*** 2: This creates a new array by concatenating the current state.messages array with a single new message (from action.value) where action.value is the actual message.
why not use push()
The difference lies in how push and concat operate:

1. How push Works:
The push method modifies the original array by adding new elements directly to it. This operation changes the existing array in memory, so any references to the array will see the updated version:

let original = [1, 2, 3];
let result = original.push(4); // Adds 4 to the original array

console.log(original); // [1, 2, 3, 4] (original array is mutated)
console.log(result);   // 4 (push returns the new length of the array)
Here, original is modified in place, which is why this method is considered mutable.

2. How concat Works:
The concat method does not modify the original array. Instead, it creates a new array that includes the elements from the original array and any additional elements you specify. The original array remains unchanged:

let original = [1, 2, 3];
let result = original.concat(4); // Creates a new array with the added element

console.log(original); // [1, 2, 3] (original array is not mutated)
console.log(result);   // [1, 2, 3, 4] (new array)
In this case, original stays intact, and result holds a completely new array. This makes concat an immutable operation.
Placing action.value within square brackets ensures it is treated as a single-element array, making the concat operation safe and consistent.
*/
