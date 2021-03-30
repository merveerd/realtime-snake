const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const { initGame, gameLoop, getDirection } = require("./game");
const { makeid } = require("./utils");

app.use(cors());
const FRAME_RATE = 20,
  state = {},
  allClients = [],
  clientRooms = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let gameInterval,
    counter = 18;
  allClients.push(socket);

  const stopGame = () => {
    counter = 18;
    clearInterval(gameInterval);
  };

  const finishGame = (gameId) => {
    let gameState = state[gameId];
    io.to(gameId).emit("timeOver", JSON.stringify({ gameState }));
    stopGame();
  };

  const countDown = (gameId) => {
    counter--;
    io.to(gameId).emit("timer", counter);
    if (counter == 0) {
      finishGame(gameId);
    }
  };

  const cancelGame = (gameId) => {
    state[gameId] = null;
    io.to(gameId).emit("canceled", counter);
    stopGame();
  };

  const pauseGame = (gameId) => {
    stopGame();
  };

  const handleJoinGame = (gameId) => {
    const room = io.sockets.adapter.rooms.get(gameId);
    let allUsers;
    if (room) {
      allUsers = room.size;
    }
    if (allUsers === 0) {
      socket.emit("unknownCode");
      return;
    } else if (allUsers > 1) {
      socket.emit("tooManyPlayers");
      return;
    } else {
      clientRooms[socket.id] = gameId;
      socket.join(gameId);
      io.to(gameId).emit("joined", state[gameId]);

      startGameInterval(gameId);
    }
  };

  const createTwoPlayerGame = () => {
    let gameId = makeid(10);
    socket.emit("gameUrl", `http://localhost:3000/${gameId}`);
    clientRooms[socket.id] = gameId;
    state[gameId] = initGame();
    state[gameId].playerNumber = 2;
    state[gameId].gameId = gameId;
    socket.join(gameId);
  };

  const createSingleGame = () => {
    let gameId = makeid(10);
    clientRooms[socket.id] = gameId;
    state[gameId] = initGame();
    state[gameId].playerNumber = 1;
    state[gameId].gameId = gameId;
    socket.join(gameId);
    socket.emit("start", state[gameId]);

    startGameInterval(gameId);
  };

  const handleKeydown = ({ keyCode, userId }) => {
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

    const currentPlayer = state[gameId] && state[gameId].players[userId - 1];
    const directionInfo = getDirection(keyCode);
    if (
      currentPlayer &&
      directionInfo && //in case of pressing other buttons
      directionInfo.axis !== currentPlayer.axis
    ) {
      currentPlayer.vel = { x: directionInfo.x, y: directionInfo.y };
      currentPlayer.axis = directionInfo.axis;
      state[gameId].lastPlayedPlayer = userId;
    }
  };

  const startGameInterval = (gameId) => {
    let gameCounter = 0;
    gameInterval = setInterval(() => {
      gameCounter++;
      if (gameCounter % FRAME_RATE === 0) {
        countDown(gameId);
      }
      gameLoop(state[gameId]);
      emitGameState(gameId, state[gameId]);
    }, 1000 / FRAME_RATE);
  };

  const playAgain = (gameId) => {
    if (state[gameId]) {
      const currentPlayerNumber = state[gameId].playerNumber;

      state[gameId] = initGame();
      state[gameId].gameId = gameId;
      state[gameId].playerNumber = currentPlayerNumber;

      currentPlayerNumber === 2
        ? io.to(gameId).emit("joined", state[gameId])
        : socket.emit("start", state[gameId]);

      startGameInterval(gameId);
    }
  };

  socket.on("disconnect", () => {
    allClients.splice(allClients.indexOf(socket), 1);
  });

  socket.on("keydown", handleKeydown);
  socket.on("newSingleGame", createSingleGame);
  socket.on("newTwoPlayerGame", createTwoPlayerGame);
  socket.on("secondJoined", handleJoinGame);
  socket.on("playAgain", playAgain);
  socket.on("cancelGame", cancelGame);
  socket.on("pauseGame", (gameId) => {
    clearInterval(gameInterval);
    io.to(gameId).emit("paused", counter);
  });
  socket.on("restartGame", (gameId) => {
    startGameInterval(gameId);
  });
  const emitGameState = (gameId, gameState) => {
    io.to(gameId).emit("gameState", JSON.stringify(gameState));
  };
});

server.on("error", (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log("server is running on 8080");
});
