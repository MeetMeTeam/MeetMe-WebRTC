const serverStore = require("../../serverStore");

const updateRooms = (toSpecifiedSocketId = null) => {
  const io = serverStore.getSocketServerInstance();
  const activeRooms = serverStore.getActiveRooms();

  if (toSpecifiedSocketId) {
    console.log("1")
    io.emit("active-rooms", {
      activeRooms,
    });
  } else {
    console.log("2")
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};

module.exports = {
  updateRooms,
};
