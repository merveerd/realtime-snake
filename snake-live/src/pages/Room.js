import React from "react";
import { Button, GameBoard } from "../components";
const Room = (props) => {
  return (
    <div>
      <Button text="cancel" />
      <GameBoard></GameBoard>
    </div>
  );
};

export { Room };
