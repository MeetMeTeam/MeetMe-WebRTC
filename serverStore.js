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
    userNameCreate: "default room",

    cate: [
      {
        id: 20,
        name: "🧑🏻‍💻 General",
        color: "bg-yellow-50",
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
  name: "ชั้นด่านฟ้า⭑☁.๋࣭ ⭑",
  type: "VOICE",
  detail: {
    userNameCreate: "default room",
    cate: [
      {
        id: 9,
        name: "🎨 Art",
        color: "bg-yellow-60",
      },
      {
        id: 7,
        name: "💬 Consult",
        color: "bg-blue-60",
      },
      {
        id: 13,
        name: "🎭 Creativity",
        color: "bg-purple-30",
      },
    ],
    theme: {
      index: 0,
      name: "Sunset Sky",
      link: "https://firebasestorage.googleapis.com/v0/b/meetme-1815f.appspot.com/o/theme%2F1373862-sunset-sky-comet-anime-art-4k-pc-wallpaper.jpg?alt=media&token=a233cde7-9b43-46ac-a2b7-21b4806b4c9f",
    },
  },
  password: "123456",
});
addNewActiveRoom("default", "default", {
  name: "ห้องทานข้าว🥘",
  type: "VOICE",
  detail: {
    userNameCreate: "default room",

    cate: [
      {
        id: 20,
        name: "🧑🏻‍💻 General",
        color: "bg-yellow-50",
      },
    ],
    theme: {
      index: 1,
      name: "Lobby",
      link: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/db935b0d-dc38-4b33-b784-38d334eb12af/deaddwc-3b08b1e2-b734-4062-b0ce-90bd0c581321.jpg/v1/fill/w_1024,h_576,q_75,strp/cinema_lobby___visual_novel_bg_by_gin_1994_deaddwc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvZGI5MzViMGQtZGMzOC00YjMzLWI3ODQtMzhkMzM0ZWIxMmFmXC9kZWFkZHdjLTNiMDhiMWUyLWI3MzQtNDA2Mi1iMGNlLTkwYmQwYzU4MTMyMS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.dpcjynKZtGxtOrCs-cMJAt1dtf_nN_lcZTSg3Mhd7Uc",
    },
  },
  password: "123456",
});
addNewActiveRoom("default", "default", {
  name: "เพื่อไทย เมื่อไหร่จะแจกเงินหมื่น",
  type: "VOICE",
  detail: {
    userNameCreate: "default room",

    cate: [
      {
        id: 12,
        name: "🏛️ Politics",
        color: "bg-yellow-30",
      },
      {
        id: 18,
        name: "😡 Vulgar words",
        color: "bg-red-70",
      },
    ],
    theme: {
      index: 1,
      name: "sea",
      link: "https://firebasestorage.googleapis.com/v0/b/meetme-1815f.appspot.com/o/theme%2Fmarnie021.jpg?alt=media&token=4473f683-224b-4b3f-82b6-8eaf0f20d0b7",
    },
  },
  password: "123456",
});
addNewActiveRoom("default", "default", {
  name: "เรื่องสยองสองบรรทัด",
  type: "VOICE",
  detail: {
    userNameCreate: "default room",

    cate: [
      {
        id: 2,
        name: "👻 Scare",
        color: "bg-purple-80",
      },
      {
        id: 16,
        name: "👨‍💼 Adult",
        color: "bg-yellow-70",
      },
    ],
    theme: {
      index: 1,
      name: "Suspicious Town",
      link: "https://firebasestorage.googleapis.com/v0/b/meetme-1815f.appspot.com/o/theme%2Ftown.jpg?alt=media&token=2ed7270e-80a9-4cf0-9993-5b040f8018b2",
    },
  },
  password: "123456",
});

addNewActiveRoom("default", "default", {
  name: "เตรียมสอบ",
  type: "VOICE",
  detail: {
    userNameCreate: "default room",

    cate: [
      {
        id: 4,
        name: "🎓 Education",
        color: "bg-gray-70",
      },
      {
        id: 17,
        name: "👦 Teenager",
        color: "bg-pink-400",
      },
      {
        id: 7,
        name: "💬 Consult",
        color: "bg-blue-60",
      },
    ],
    theme: {
      index: 1,
      name: "warm house",
      link: "https://firebasestorage.googleapis.com/v0/b/meetme-1815f.appspot.com/o/theme%2Fponyo006.jpg?alt=media&token=3b8be510-e6e3-4c87-9371-5ff6ceb6a040",
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
  for (let index = 0; index < room.participants.length; index++) {
    if (room.participants[index].userId === newParticipant.userId) {
      check = false;
    }
  }

  if (room) {
    if (check) {
      const updatedRoom = {
        ...room,
        participants: [...room.participants, newParticipant],
      };
      activeRooms.push(updatedRoom);
    } else {
      const updatedRoom = {
        ...room,
        participants: room.participants,
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
