const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();
let activeRooms = [];
let passwordActiveRooms = [];

let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

const removeUserFromRoom = (data) => {
  console.log(data);
  const newActiveRoom = activeRooms;
  newActiveRoom.forEach((room) => {
    const Participants = [];
    room.participants.forEach((participant) => {
      let check = false;
      if (participant.userId === "default") {
        check = false;
      }
      if (participant.userId === data.userId) {
        getSocketServerInstance().emit("remove-from-room", {
          userId: data.userId,
          socketId: data.socketId,
        });
      }
      if (participant.userId !== data.userId) {
        Participants.push(participant);
      }
    });

    room.participants = Participants;
  });

  console.log(newActiveRoom);
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
};

const getActiveConnections = (userId) => {
  const activeConnections = [];

  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  connectedUsers.forEach((value, key) => {});
  return onlineUsers;
};

setInterval(() => {
  removeInvalidParticipants();
}, [3000]);

function removeInvalidParticipants() {
  activeRooms.forEach((room) => {
    const validParticipants = [];
    room.participants.forEach((participant) => {
      const connectedUsersId = [];
      connectedUsers.forEach((value, key) => {
        connectedUsersId.push(value.userId);
      });

      let check = false;
      if (participant.userId === "default") {
        check = true;
      } else {
        check = connectedUsersId.some(
          (userId) => userId === participant.userId
        );
      }

      if (check) {
        validParticipants.push(participant);
      }
    });

    room.participants = validParticipants;
  });
}

//room
const addNewActiveRoom = (userId, socketId, data) => {
  const roomId = uuidv4();
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
      roomName: data.name,
      type: data.type,
      detail: data.detail,
    },
    participants: [
      {
        userId,
        socketId,
        name: data.name,
      },
    ],
    roomId: roomId,
  };
  const privateData = {
    password: data.password,
    roomId: roomId,
  };
  activeRooms = [...activeRooms, newActiveRoom];
  passwordActiveRooms = [...passwordActiveRooms, privateData];

  console.log("new active rooms: ");

  return newActiveRoom;
};
const data = {
  detail: {
    theme: {
      index: 2,
      name: "bar",
      link: "https://cdnb.artstation.com/p/assets/images/images/035/693/525/large/daryna-vladimirova-.jpg?1615642496",
    },
  },
};
addNewActiveRoom("default", "default", {
  name: "ห้องนั่งเล่น🛋️",
  type: "VOICE",
  detail: {
    cate: [
      {
        id: 5,
        name: "🧑🏻‍💻 General",
        color: "bg-yellow-70",
      },
      {
        id: 1,
        name: "🤪 Fun ",
        color: "bg-yellow-40",
      },
    ],
    theme: {
      index: 2,
      name: "bar",
      link: "https://cdnb.artstation.com/p/assets/images/images/035/693/525/large/daryna-vladimirova-.jpg?1615642496",
    },
  },
  password: "123456",
});
addNewActiveRoom("default", "default", {
  name: "ชั้นด่านฟ้าท้าทดลอง๋࣭ ⭑☁.๋࣭ ⭑",
  type: "VOICE",
  detail: {
    cate: [
      {
        id: 5,
        name: "⚽ Hobbies",
        color: "bg-blue-80",
      },
    ],
    theme: {
      index: 2,
      name: "bar",
      link: "https://cdnb.artstation.com/p/assets/images/images/035/693/525/large/daryna-vladimirova-.jpg?1615642496",
    },
  },
  password: "123456",
});
addNewActiveRoom("default", "default", {
  name: "ห้องทานข้าว🥘",
  type: "VOICE",
  detail: {
    cate: [
      {
        id: 5,
        name: "🧑🏻‍💻 General",
        color: "bg-yellow-70",
      },
    ],
    theme: {
      index: 2,
      name: "bar",
      link: "https://cdnb.artstation.com/p/assets/images/images/035/693/525/large/daryna-vladimirova-.jpg?1615642496",
    },
  },
  password: "123456",
});

const getActiveRooms = () => {
  return [...activeRooms];
};

const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find(
    (activeRoom) => activeRoom.roomId === roomId
  );

  if (activeRoom) {
    return {
      ...activeRoom,
    };
  } else {
    return null;
  }
};

const checkRoom = (roomId) => {
  check = activeRooms.find((room) => room.roomId === roomId);
  if (check) {
    return true;
  } else return false;
};

const joinActiveRoom = (roomId, newParticipant) => {
  const room = activeRooms.find((room) => room.roomId === roomId);
  activeRooms = activeRooms.filter((room) => room.roomId !== roomId);
  let check = true;
  for (let index = 0; index < room.participant.length; index++) {
    if (room.participant[index].userId === newParticipant.userId) {
      check = false;
    }
  }
  if (check) {
    if (room) {
      const updatedRoom = {
        ...room,
        participants: [...room.participants, newParticipant],
      };
      activeRooms.push(updatedRoom);
    }
  }
};

const leaveActiveRoom = (roomId, participantSocketId) => {
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);

  if (activeRoom) {
    const copyOfActiveRoom = { ...activeRoom };

    copyOfActiveRoom.participants = copyOfActiveRoom.participants.filter(
      (participant) => participant.socketId !== participantSocketId
    );

    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

    if (copyOfActiveRoom.participants.length > 0) {
      activeRooms.push(copyOfActiveRoom);
    }
  }
};

module.exports = {
  checkRoom,
  getOnlineUsers,
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  getSocketServerInstance,
  setSocketServerInstance,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
  removeUserFromRoom,
};
