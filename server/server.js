const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const { initGame, gameLoop, getDirection } = require("./game");
const { makeid } = require("./utils");

const FRAME_RATE = 10,
  state = {},
  clientRooms = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const setInitValues = (gameId) => {
    socket.join(gameId);
    socket.emit("init", state[gameId]);
    startGameInterval(gameId);
  };

  const handleNewGame = () => {
    let gameId = makeid(5);

    clientRooms[socket.id] = gameId;

    socket.emit("gameCode", gameId);
    state[gameId] = initGame();
    state[gameId].playerNumber = 1;

    setInitValues(gameId);
  };

  const handleKeydown = (keyCode) => {
    const gameId = clientRooms[socket.id];
    if (!gameId) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }
    const currentPlayer =
      state[gameId] && state[gameId].players[state[gameId].playerNumber - 1];

    const directionInfo = getDirection(keyCode);
    if (
      currentPlayer &&
      directionInfo && //in case of pressing other buttons
      directionInfo.axis !== currentPlayer.axis
    ) {
      currentPlayer.vel = { x: directionInfo.x, y: directionInfo.y };
      currentPlayer.axis = directionInfo.axis;
    }
  };
  socket.on("keydown", handleKeydown);
  socket.on("newGame", handleNewGame);
});

const startGameInterval = (gameId) => {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[gameId]);

    if (!winner) {
      emitGameState(gameId, state[gameId]);
    } else {
      emitGameOver(gameId, winner);
      state[gameId] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
};

const emitGameState = (room, gameState) => {
  // Send this event to everyone in the room.
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
};

const emitGameOver = (room, winner) => {
  io.sockets.in(room).emit("gameOver", JSON.stringify({ winner }));
};

server.on("error", (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log("server is running on 8080");
});
