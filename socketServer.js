const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const friendInviteHandler = require("./socketHandlers/friendInviteHandler");
const roomLeaveHandler = require("./socketHandlers/roomLeaveHandler");
const roomInitializeConnectionHandler = require("./socketHandlers/roomInitializeConnectionHandler");
const roomSignalingDataHandler = require("./socketHandlers/roomSignalingDataHandler");

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
  // io.use((socket, next) => {
  //   authSocket(socket, next);
  // });

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
      console.log("direct-chat-history");
      directChatHistoryHandler(socket, data);
    });

    socket.on("room-create", (data) => {
      roomCreateHandler(socket, data);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on("chatter", (data) => {
      console.log("chatter", data.name);
      if (data.message.people) {
        console.log("test");
        io.to(socket.id).emit("chatter", data.message);
        data.message.people.forEach((participant) => {
          io.to(participant.socketId).emit("chatter", data.message);
        });
      } else {
        io.emit("chatter", data.message);
      }
    });

    socket.on("cam-change", (data) => {
      data.peopleInRoom.forEach((participant) => {
        socket.to(participant.socketId).emit("other-cam-change", {
          userId: data.userId,
          isCameraEnabled: data.isCameraEnabled,
          image: data.image,
          socketId: socket.id,
        });
      });
      // io.emit('chatter', message)
    });

    socket.on("sendFriendInvite", (data) => {
      friendInviteHandler(socket, data);
    });

    socket.on("invite-room", (data) => {
      const onlineUsers = serverStore.getOnlineUsers();
      for (let index = 0; index < onlineUsers.length; index++) {
        if (onlineUsers[index].userId === data.id) {
          console.log("1");
          io.to(onlineUsers[index].socketId).emit("invite-room", data);
        }
      }
    });

    socket.on("send-gift-to-other", (data) => {
      console.log(data);
      io.to(socket.id).emit("other-send-gift", data);
      for (let index = 0; index < data.otherPeople.length; index++) {
        io.to(data.otherPeople[index].connUserSocketId).emit(
          "other-send-gift",
          data
        );
      }
      const message = {
        color: "black",
        name: "system",
        text: `คุณ ${data.userDetail.displayName} ได้ส่งของขวัญให้กับ ${data.selectUser.name.displayName}`,
        textId: data.idText,
        isGift: true,
      };
      io.to(socket.id).emit("chatter", message);
      data.otherPeople.forEach((participant) => {
        io.to(participant.connUserSocketId).emit("chatter", message);
      });
    });

    socket.on("notify-join", (data) => {
      io.to(socket.id).emit("notify-join", serverStore.checkRoom(data));
    });
    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 8]);
};

module.exports = {
  registerSocketServer,
};
