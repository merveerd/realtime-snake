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
  clientRooms = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "https://6063491aae4fe01154fcce5d--snake-realtime.netlify.app",
    methods: ["GET", "POST"],
  },
});
let counter = 180;
let serverInterval = (() => {
  let gameInterval;
  return {
    set: (obj) => {
      gameInterval = obj;
    },
    get: () => {
      return gameInterval;
    },
  };
})();

io.on("connection", (socket) => {
  const handleJoinGame = (gameId) => {
    const room = io.sockets.adapter.rooms.get(gameId);
    let allUsers;
    if (room) {
      allUsers = room.size;
    }
    if (!allUsers) {
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
    socket.emit(
      "gameUrl",
      `https://6063491aae4fe01154fcce5d--snake-realtime.netlify.app/${gameId}`
    );
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

  const countDown = (gameId) => {
    counter--;
    io.to(gameId).emit("timer", counter);
    if (counter == 0) {
      finishGame(gameId);
    }
  };

  const startLoop = (gameId) => {
    let gameCounter = 0;

    serverInterval.set(
      setInterval(() => {
        gameCounter++;
        if (gameCounter % FRAME_RATE === 0) {
          countDown(gameId);
        }
        gameLoop(state[gameId]);
        emitGameState(gameId, state[gameId]);
      }, 1000 / FRAME_RATE)
    );
  };
  const startGameInterval = (gameId) => {
    startLoop(gameId);
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

  const stopGame = () => {
    counter = 180;
    clearInterval(serverInterval.get());
  };

  const finishGame = (gameId) => {
    let gameState = state[gameId];
    io.to(gameId).emit("timeOver", JSON.stringify({ gameState }));
    stopGame();
  };

  const cancelGame = (gameId) => {
    io.to(gameId).emit("canceled", true);
    stopGame();

    state[gameId] = null;
  };

  socket.on("disconnect", () => {
    let gameId = clientRooms[socket.id];
    cancelGame(gameId);
  });

  socket.on("keydown", handleKeydown);
  socket.on("newSingleGame", createSingleGame);
  socket.on("newTwoPlayerGame", createTwoPlayerGame);
  socket.on("secondJoined", handleJoinGame);
  socket.on("playAgain", playAgain);
  socket.on("cancelGame", cancelGame);

  socket.on("pauseGame", (gameId) => {
    clearInterval(serverInterval.get());
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
