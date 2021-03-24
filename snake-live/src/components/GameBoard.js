import React, { memo, useRef, useContext, useState, useEffect } from "react";
import { SocketContext } from "../socketClient";

const GameBoard = memo((props) => {
  const numCells = 20;
  const canvasRef = useRef(null);
  const socket = useContext(SocketContext);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [snake, setSnake] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setContext(context);
    context.fillStyle = "blue";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    draw(context);
    document.body.addEventListener("keydown", changeDirectionWithKeys);

    return () => {
      document.body.removeEventListener("keydown", changeDirectionWithKeys);
    };
  }, []);

  socket.on("position", function (data) {
    setPosition(data);

    context && context.fillRect(position.x, position.y, 20, 20);
  });

  const setDirection = (direction) => {
    socket.emit("move", direction);
  };

  //keyboard listeners
  const changeDirectionWithKeys = (e) => {
    let { keyCode } = e;
    switch (keyCode) {
      case 37:
        setDirection("left");
        break;
      case 38:
        setDirection("up");
        break;
      case 39:
        setDirection("right");
        break;
      case 40:
        setDirection("down");
        break;
      default:
        break;
    }
  };

  const draw = (ctx) => {
    //move it to the helper
    const cellSize = Math.floor(ctx.canvas.width / numCells);
    const drawGrid = () => {
      //make seperate initialization
      ctx.beginPath();
      ctx.strokeStyle = "pink";
      for (let i = 0; i < numCells + 1; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, cellSize * numCells);

        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(cellSize * numCells, i * cellSize);
      }

      ctx.stroke();
    };

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid();
  };

  return <canvas width="800" height="800" ref={canvasRef} />;
});

export { GameBoard };
