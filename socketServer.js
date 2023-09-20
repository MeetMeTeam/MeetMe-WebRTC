const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");

const serverStore = require("./serverStore");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);

  //เมื่อคอนเน็ก จะไปวาลิเดท โทเค้นก่อน
  io.use((socket, next) => {
    // console.log(socket.user)
    authSocket(socket, next);
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  //ถ้าผ่านจะไปคอนเน็ก
  io.on("connection", (socket) => {
    // console.log(socket.handshake.auth);
    //เวลาที่มี connect มาจะไปเพิ ่มเข้า store
    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
        console.log("direct-chat-history")
        directChatHistoryHandler(socket, data);
      });

      socket.on("room-create", () => {
        roomCreateHandler(socket);
      });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket ,data);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 8]);
};

module.exports = {
  registerSocketServer,
};
