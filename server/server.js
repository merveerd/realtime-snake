const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let position = {
  x: 250,
  y: 250,
};

//food,whole snake

// const randomPosition = () => { // for food
//   const position = {
//       x: Math.floor(Math.random()*width),
//       y: Math.floor(Math.random()*height)};
//   return position;
// }

io.on("connection", (socket) => {
  socket.emit("position", position);
  socket.on("move", (data) => {
    switch (data) {
      case "left":
        position.x = -20;
        io.emit("position", position);
        break;
      case "right":
        position.x = +20;
        io.emit("position", position);
        break;
      case "up":
        position.y = -20;
        io.emit("position", position);
        break;
      case "down":
        position.y = +20;
        io.emit("position", position);
        break;
    }
  });
});

io.on("connection", function (socket) {
  socket.emit("chat message", "everyone");
  console.log("connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});
// io.on("connection", (socket) => {
//   const color = "green";
//   let isTimeOut = false;
//   socket.on("message", (text) => io.emit("message", text)); //win, start etc

//   socket.on("turn", ({ x, y }) => {
//     if (isTimeOut) {
//       io.emit("turn", { x, y, color });

//       if (isTimeOut) {
//         socket.emit("message", "You Won!");
//         io.emit("message", "New Round");
//         clear();
//         io.emit("board");
//       }
//     }
//   });
// });

server.on("error", (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log("server is running on 8080");
});
