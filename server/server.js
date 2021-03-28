const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const { initGame, gameLoop, getDirection } = require("./game");
const { makeid } = require("./utils");

const FRAME_RATE = 20,
  state = {},
  clientRooms = {};

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let duration,
    gameInterval,
    counter = 5;
  const setInitValues = (gameId) => {
    socket.join(gameId);
    socket.emit("init", state[gameId]);

    startGameInterval(gameId);
  };

  const finishGame = (gameId) => {
    if (state[gameId].playerNumber === 1) {
      winner = 1;
    } else {
      let players = state[gameId].players;
      if (players[0].score > players[1].score) {
        winner = 1;
      } else if (players[0].score < players[1].score) {
        winner = 2;
      } else if (players[0].score === players[1].score) {
        winner = 3;
      }
    }

    emitGameOver(gameId, state[gameId], winner);
    stopGame(gameId);
  };

  const countDown = (gameId) => {
    counter--;
    socket.emit("timer", counter);
    if (counter == 0) {
      finishGame(gameId);
    }
  };

  const stopGame = (gameId) => {
    state[gameId] = null;
    counter = 5;
    clearInterval(gameInterval);
    clearInterval(duration);
  };

  const createSingleGame = () => {
    let gameId = makeid(10);
    clientRooms[socket.id] = gameId;
    socket.emit("gameCode", gameId); //for two
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
  const startGameInterval = (gameId) => {
    duration = setInterval(() => {
      countDown(gameId);
    }, 1000);
    gameInterval = setInterval(() => {
      gameLoop(state[gameId]);
      emitGameState(gameId, state[gameId]);
    }, 1000 / FRAME_RATE);
    socket.on("cancelGame", stopGame);
  };

  socket.on("keydown", handleKeydown);
  socket.on("newGame", createSingleGame);
});

const emitGameState = (room, gameState) => {
  // Send this event to everyone in the room.
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
};

const emitGameOver = (room, gameState, winner) => {
  io.sockets.in(room).emit("gameOver", JSON.stringify({ gameState, winner }));
};

server.on("error", (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log("server is running on 8080");
});
