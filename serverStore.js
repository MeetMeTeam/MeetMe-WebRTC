const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();
let activeRooms = [];

let io = null

  const setSocketServerInstance = (ioInstance) => {
    io = ioInstance;
  };
  
  const getSocketServerInstance = () => {
    return io;
  };


const addNewConnectedUser = ({ socketId, userId}) => {
    connectedUsers.set(socketId , {userId})
    console.log('new connect users')
    // console.log(connectedUsers)
}

const removeConnectedUser = (socketId)=>{
    if(connectedUsers.has(socketId)){
        connectedUsers.delete(socketId);
        console.log('users disconnect')
        // console.log(connectedUsers)

    }
}

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
  
    return onlineUsers;
  };

  //room

  const addNewActiveRoom = (userId, socketId , data) => {
    const newActiveRoom = {
      roomCreator: {
        userId,
        socketId,
        roomName : data.name,
        type  : data.type
      },
      participants: [
        {
          userId,
          socketId,
          name:data.name ,
          
        },
      ],
      roomId: uuidv4(),
    };
  
    activeRooms = [...activeRooms, newActiveRoom];
  
    console.log("new active rooms: ");
    // console.log(activeRooms);
  
    return newActiveRoom;
  };

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
   check = activeRooms.find((room) => room.roomId === roomId)
if(check) {
  return true
}else
 return  false ;
  };

  const joinActiveRoom = (roomId, newParticipant) => {
    const room = activeRooms.find((room) => room.roomId === roomId);
    console.log("room has been found");
    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

  if(room){
      const updatedRoom = {
      ...room,
      participants: [...room.participants, newParticipant],
    };
  
    activeRooms.push(updatedRoom);
  }
  
  
    
    console.log(activeRooms)
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
    leaveActiveRoom
}