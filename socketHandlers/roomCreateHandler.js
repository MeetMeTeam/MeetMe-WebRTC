const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/rooms");

const roomCreateHandler = (socket, data) => {
  console.log("handling room create event");
  const socketId = socket.id;
  const userId = socket.handshake.auth?.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId, data);

  socket.emit("room-create", {
    roomDetails,
  });

  roomsUpdates.updateRooms();
};

module.exports = roomCreateHandler;
