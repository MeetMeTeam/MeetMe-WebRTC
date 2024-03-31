const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandlers/updates/friends");
const roomsUpdate = require("./updates/rooms");

const newConnectionHandler = async (socket, io) => {
  const onlineUsers = serverStore.getOnlineUsers();

  const userDetails = socket.user;
  const userId = socket.handshake.auth?.userId;

  // Check if the user is already connected
  const alreadyConnected = onlineUsers.some((user) => user.userId === userId);

  if (!alreadyConnected) {
    serverStore.addNewConnectedUser({
      socketId: socket.id,
      userId: userId,
    });
  }

  setTimeout(() => {
    roomsUpdate.updateRooms(socket.id);
  }, 1000);
};

const checkUserInRoom = async (socket, io, data) => {
  const userId = socket.handshake.auth?.userId;
  if (data.isUserInRoom === false) {
    const activeRooms = serverStore.getActiveRooms();

    activeRooms.forEach((room) => {
      const validParticipants = [];
      room.participants.forEach((participant) => {
        let check = false;
        if (participant.userId === "default") {
          check = false;
        }
        if (participant.userId === userId) {
          serverStore.removeUserFromRoom({
            roomId: room.roomId,
            userId: userId,
          });
        }
      });

      // room.participants = validParticipants;
    });
  }
  roomsUpdate.updateRooms(socket.id);
};

module.exports = { newConnectionHandler, checkUserInRoom };
