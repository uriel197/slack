module.exports = (incomingPost) => {
  let maybeCreatedAt;
  try {
    const array = incomingPost.createdAt.split("T");
    const date = array[0];
    const time = array[1].substring(0, 5);
    maybeCreatedAt = `${date} ${time}`;
  } catch (error) {
    maybeCreatedAt = "";
  }
  return {
    imageUrl: incomingPost.imageUrl ?? "",
    username: incomingPost.username ?? "",
    createdAt: maybeCreatedAt,
    text:
      incomingPost.text
        .replace(/\n/g, "<br/>")
        .substring(0, Math.floor(Math.random() * incomingPost.text.length)) ||
      "",
  };
};

/*
    =========================================
        COMMENTS - COMMENTS - COMMENTS
    =========================================

 A utility function for formatting and structuring incoming post data into the required format.
 
*/
