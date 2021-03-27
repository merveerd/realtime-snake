const GRID_NUMBER = 20;

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
          x: 18,
          y: 10,
        },
        axis: "",
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          { x: 20, y: 10 },
          { x: 19, y: 10 },
          { x: 18, y: 10 },
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
    console.log("2.1");
    return 2;
  }

  if (
    playerTwo.pos.x < 0 ||
    playerTwo.pos.x > GRID_NUMBER ||
    playerTwo.pos.y < 0 ||
    playerTwo.pos.y > GRID_NUMBER
  ) {
    console.log("1.1");
    return 1;
  }

  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.score += 10;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    randomFood(state);
  }

  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.score += 10;
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    randomFood(state);
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    for (let cell of playerOne.snake) {
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        console.log("2.2");
        return 2;
      }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    for (let cell of playerTwo.snake) {
      if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
        console.log("1.2");
        return 1;
      }
    }

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  return false;
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
