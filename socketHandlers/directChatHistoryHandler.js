const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;
    // const conversation = await Conversation.findOne({
    //   participants: { $all: [userId, receiverUserId] },
    //   type: "DIRECT",
    // });
    console.log("finding")

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });
    

    if (conversation) {
      console.log("find already")
      chatUpdates.updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
