const UserView = (user) => {
  return {
    id: user._id,
    username: user.username,
    lastVisitedChannel: user.lastVisitedChannel,
  };
};

module.exports = UserView;

/*
    ======================================
        COMMENTS - COMMENTS - COMMENTS
    ======================================

*** Note: UserView transforms a database user object (retrieved via your backend) into a clean, frontend-friendly format.

Key Points:
It explicitly maps fields from the raw MongoDB user document.
For example:
user._id ➡ id
Other fields like username and lastVisitedChannel are passed as-is.
This is commonly used on the server side (e.g., in services or API endpoints) to format the user object before sending it to the client.
*/
