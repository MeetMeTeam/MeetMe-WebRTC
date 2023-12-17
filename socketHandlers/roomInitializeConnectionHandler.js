const roomInitializeConnectionHandler = (socket, data) => {
    const { connUserSocketId , name , pic , id} = data;
  
    const initData = { connUserSocketId: socket.id , name , pic ,id};
    socket.to(connUserSocketId).emit("conn-init", initData);
  };
  
  module.exports = roomInitializeConnectionHandler;
  