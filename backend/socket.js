// let io;

// module.exports = {
//   init: (server) => {
//     io = require("socket.io")(server);
//     return io;
//   },

//   getIO: () => {
//     if (!io) throw new Error("io not found");
//     return io;
//   },
// };

let io;
const { Server } = require("socket.io");

module.exports = {
  init: (server) => {
    // io = new Server(server, { cors: { origin: "http://localhost:3000" } });
    io = new Server(server, {
      cors: { origin: "https://chats-rocket.herokuapp.com/" },
    });
    return io;
  },

  getIO: () => {
    if (!io) throw new Error("io not found");
    return io;
  },
};
