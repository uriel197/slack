module.exports = (incomingMessage) => {
  let maybeCreatedAt;
  try {
    if (!incomingMessage) console.log("there is no message from chat/Message");

    const array = incomingMessage.createdAt.split("T");
    const date = array[0];
    const time = array[1].substring(0, 5);
    maybeCreatedAt = `${date} ${time}`;
  } catch (error) {
    console.log("chat/message:", error);
    maybeCreatedAt = "";
  }
  return {
    channelId: incomingMessage.channelId || "",
    username: incomingMessage?.user?.username || "",
    createdAt: maybeCreatedAt,
    text: incomingMessage.text.replace(/\n/g, "<br/>") || "",
  };
};
