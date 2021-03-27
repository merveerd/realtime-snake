import React, { memo, useRef, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../socketClient";

const GameBoard = memo((props) => {
  const room = useSelector((state) => state.roomResponse);
  const { playerNumber, gridNumber, gameActive } = room;

  const canvasRef = useRef(null);
  const socket = useContext(SocketContext);

  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setContext(context);
  }, []);

  useEffect(() => {
    if (context && gridNumber && playerNumber) {
      socket.on("gameState", handleGameState);
      return () => {
        socket.off("gameState", handleGameState);
      };
    }
  }, [context, gridNumber, playerNumber]);

  useEffect(() => {
    if (gameActive) {
      const keyDown = (e) => {
        if (gameActive) {
          socket.emit("keydown", e.keyCode);
        }
      };

      document.body.addEventListener("keydown", keyDown, true);
      return () => {
        document.body.removeEventListener("keydown", keyDown, true);
      };
    }
  }, [gameActive]);

  const handleGameState = (gameState) => {
    if (!gameActive) {
      console.log("return state", gameActive);

      return;
    }
    requestAnimationFrame(() => paintGame(JSON.parse(gameState)));
  };

  let food, size;
  const paintGame = (state) => {
    food = state.food;
    size = context.canvas.width / gridNumber;

    context.fillStyle = "#e88574"; //board
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = "#66c2ff"; //food
    context.fillRect(food.x * size, food.y * size, size, size);

    drawGrid();
    drawSnake(state.players[0], size, "#9cf0cd");

    playerNumber === 2 && drawSnake(state.players[1], size, "red");
  };

  const drawGrid = () => {
    const cellSize = Math.floor(context.canvas.width / gridNumber);
    context.beginPath();
    context.strokeStyle = "pink";
    for (let i = 0; i < gridNumber + 1; i++) {
      context.moveTo(i * cellSize, 0);
      context.lineTo(i * cellSize, cellSize * gridNumber);

      context.moveTo(0, i * cellSize);
      context.lineTo(cellSize * gridNumber, i * cellSize);
    }

    context.stroke();
  };

  const drawSnake = (playerState, size, colour) => {
    const snake = playerState.snake;

    context.fillStyle = colour;
    for (let cell of snake) {
      context.fillRect(cell.x * size, cell.y * size, size, size);
    }
  };

  return <canvas width="800" height="800" ref={canvasRef} />;
});

export { GameBoard };
