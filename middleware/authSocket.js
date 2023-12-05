const jwt = require("jsonwebtoken");

const config = process.env;

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    // console.log(config.TOKEN_KEY)
    console.log(socket.handshake.auth?.token)
    console.log("------------------")
    console.log(config.TOKEN_KEY)
    const decoded = jwt.verify(token, config.TOKEN_KEY);


    socket.user = decoded;
    console.log("corret")
  } catch (err) {
    console.log("not corret")
    const socketError = new Error("NOT_AUTHORIZED");
    socket.emit("error", socketError);
    return next(socketError);
  }

  next();
};

module.exports = verifyTokenSocket;
