const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const { roomId, name, pic, id } = data;

  const participantDetails = {
    userId: socket.handshake.auth?.userId,
    socketId: socket.id,
  };

  const roomDetails = serverStore.getActiveRoom(roomId);
  serverStore.joinActiveRoom(roomId, participantDetails);
  if (roomDetails) {
    roomDetails.participants.forEach((participant) => {
      if (participant.socketId !== participantDetails.socketId) {
        socket.to(participant.socketId).emit("conn-prepare", {
          connUserSocketId: participantDetails.socketId,
          name,
          pic,
          id,
        });
      }
    });

    roomsUpdates.updateRooms();
  }
};

module.exports = roomJoinHandler;
