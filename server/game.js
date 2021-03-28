const GRID_NUMBER = 80;

const initGame = () => {
  const state = createGameState();
  randomFood(state);
  return state;
};

const createGameState = () => {
  return {
    playerNumber: 0,
    players: [
      {
        pos: {
          x: 3,
          y: 10,
        },
        axis: "horizontal",
        vel: {
          x: 1,
          y: 0,
        },
        snake: [
          { x: 1, y: 10 },
          { x: 2, y: 10 },
          { x: 3, y: 10 },
        ],
        score: 0,
      },
      {
        pos: {
          x: 10,
          y: 10,
        },
        axis: "",
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ],
        score: 0,
      },
    ],
    food: {},
    gridNumber: GRID_NUMBER,
  };
};

const gameLoop = (state) => {
  if (!state) {
    return;
  }

  //handle this in one function
  // gameState.players.forEach((player) => {});
  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  playerTwo.pos.x += playerTwo.vel.x;
  playerTwo.pos.y += playerTwo.vel.y;

  if (
    playerOne.pos.x < 0 ||
    playerOne.pos.x > GRID_NUMBER ||
    playerOne.pos.y < 0 ||
    playerOne.pos.y > GRID_NUMBER
  ) {
    randomSnake(playerOne);
    playerOne.score = 0;
  }

  if (
    playerTwo.pos.x < 0 ||
    playerTwo.pos.x > GRID_NUMBER ||
    playerTwo.pos.y < 0 ||
    playerTwo.pos.y > GRID_NUMBER
  ) {
    randomSnake(playerTwo);
    playerTwo.score = 0;
  }

  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.score += 100;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    randomFood(state);
  }

  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.score += 100;
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    for (let cell of playerOne.snake) {
      if (
        (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) ||
        ((playerTwo.vel.x || playerTwo.vel.y) &&
          cell.x === playerTwo.pos.x &&
          cell.y === playerTwo.pos.y)
      ) {
        randomSnake(playerOne);
        playerOne.score = 0;
      }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    for (let cell of playerTwo.snake) {
      if (
        (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) ||
        ((playerOne.vel.x || playerOne.vel.y) &&
          cell.x === playerOne.pos.x &&
          cell.y === playerOne.pos.y)
      ) {
        randomSnake(playerTwo);
        playerTwo.score = 0;
      }
    }

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  return false;
};

const randomNumber = () => {
  return Math.floor(Math.random() * (GRID_NUMBER - 20));
};
const randomSnake = (player) => {
  const newPos = { x: randomNumber(), y: randomNumber() };
  player.pos = newPos;
  player.snake = [
    { x: newPos.x - 3, y: newPos.y },
    { x: newPos.x - 2, y: newPos.y },
    { x: newPos.x - 1, y: newPos.y },
  ];
  player.vel = {
    x: 1,
    y: 0,
  };
  player.axis = "horizontal";
};

const randomFood = (state) => {
  food = {
    x: Math.floor(Math.random() * GRID_NUMBER),
    y: Math.floor(Math.random() * GRID_NUMBER),
  };

  for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  for (let cell of state.players[1].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  state.food = food;
};

const getDirection = (keyCode) => {
  switch (keyCode) {
    case 37: {
      return { x: -1, y: 0, direction: "left", axis: "horizontal" };
    }
    case 38: {
      return { x: 0, y: -1, direction: "down", axis: "vertical" };
    }
    case 39: {
      return { x: 1, y: 0, direction: "right", axis: "horizontal" };
    }
    case 40: {
      return { x: 0, y: 1, direction: "up", axis: "vertical" };
    }
  }
};
module.exports = {
  initGame,
  gameLoop,
  getDirection,
};
