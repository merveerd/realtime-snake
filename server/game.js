//encapsulate here
const GRID_NUMBER = 80;
let bonusScoreCounter,
  bonusRandomizer = Math.ceil(Math.random() * 2 + 2);

const initGame = () => {
  const state = createGameState();
  bonusScoreCounter = 0;
  randomFood(state);
  return state;
};

const createGameState = () => {
  return {
    playerNumber: 0,
    lastPlayedPlayer: 0,
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
          y: 1,
        },
        snake: [
          { x: 10, y: 8 },
          { x: 10, y: 9 },
          { x: 10, y: 10 },
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

  state.players.forEach((player, index) => {
    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;

    if (
      player.pos.x < 0 ||
      player.pos.x > GRID_NUMBER ||
      player.pos.y < 0 ||
      player.pos.y > GRID_NUMBER
    ) {
      randomSnake(player);
      player.score = 0;
    }

    if (state.food.x === player.pos.x && state.food.y === player.pos.y) {
      player.snake.push({ ...player.pos });
      if (state.food.bonus) {
        player.score += 200;
        bonusRandomizer = Math.ceil(Math.random() * 2 + 2);
        state.food.bonus = false;
      } else {
        player.score += 100;
      }
      player.pos.x += player.vel.x;
      player.pos.y += player.vel.y;
      randomFood(state);
    }
    const otherPlayer = index === 0 ? state.players[1] : state.players[0];

    if (player.vel.x || player.vel.y) {
      for (let cell of player.snake) {
        if (
          (cell.x === player.pos.x && cell.y === player.pos.y) ||
          ((otherPlayer.vel.x || otherPlayer.vel.y) && //random die
            cell.x === otherPlayer.pos.x &&
            cell.y === otherPlayer.pos.y &&
            state.lastPlayedPlayer === index + 1) //index+1 is equal to id in this game
        ) {
          randomSnake(player);
          player.score = 0;
        }
      }

      player.snake.push({ ...player.pos });
      player.snake.shift();
    }
  });
  return false;
};

const randomNumber = () => {
  return Math.floor(Math.random() * (GRID_NUMBER - 20)); //20 is buffer
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
  bonusScoreCounter++;

  let food = {
    x: Math.floor(Math.random() * GRID_NUMBER),
    y: Math.floor(Math.random() * GRID_NUMBER),
  };
  if (bonusScoreCounter % bonusRandomizer === 0) {
    food.bonus = true;
  }

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
      //left
      return { x: -1, y: 0, axis: "horizontal" };
    }
    case 38: {
      //down
      return { x: 0, y: -1, axis: "vertical" };
    }
    case 39: {
      //right
      return { x: 1, y: 0, axis: "horizontal" };
    }
    case 40: {
      //up
      return { x: 0, y: 1, axis: "vertical" };
    }
  }
};
module.exports = {
  initGame,
  gameLoop,
  getDirection,
};
