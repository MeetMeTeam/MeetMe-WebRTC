const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/rooms");

const friendInviteHandler = (socket,data) => {
  console.log("2")

  const onlineUsers = serverStore.getOnlineUsers()
  for (let index = 0; index < onlineUsers.length; index++) {
    
    if(onlineUsers[index].userId === data ) {
      socket.to(onlineUsers[index].socketId).emit("sendFriendInvite","new friend coming");

    }
    
  }
};

module.exports = friendInviteHandler;
