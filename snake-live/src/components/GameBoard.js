import React, { memo, useRef, useEffect } from "react";
const GameBoard = memo((props) => {
  const numCells = 20;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    draw(context);
  }, []);

  let board = Array(numCells)
    .fill()
    .map(() => Array(numCells).fill(null));

  const draw = (ctx) => {
    //move it to the helper
    const cellSize = Math.floor(ctx.canvas.width / numCells);
    const drawGrid = () => {
      //make seperate initialization
      ctx.strokeStyle = "pink";
      ctx.beginPath();

      for (let i = 0; i < numCells + 1; i++) {
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, cellSize * numCells);

        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(cellSize * numCells, i * cellSize);
      }

      ctx.stroke();
    };
    const fillCell = () => {
      ctx.fillRect(
        numCells * cellSize,
        numCells * cellSize,
        cellSize,
        cellSize
      );
    };
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    drawGrid();

    const renderBoard = (board = []) => {
      board.forEach((row, y) => {
        row.forEach((column, x) => {
          column && fillCell(x, y);
        });
      });
    };
    renderBoard(board);
  };

  return <canvas width="800" height="800" ref={canvasRef} />;
});

export { GameBoard };
