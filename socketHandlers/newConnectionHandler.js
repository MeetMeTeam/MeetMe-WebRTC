const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandlers/updates/friends");
const roomsUpdate = require("./updates/rooms");

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: socket.handshake.auth?.userId,
  });

  setTimeout(() => {
    roomsUpdate.updateRooms(socket.id);
  }, [1000]);
};

module.exports = newConnectionHandler;
