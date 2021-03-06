import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../Button";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { Container } from "../StyledContainer";

const Bar = (props) => {
  const gameActive = useSelector((state) => state.roomResponse.gameActive);

  const [paused, setPaused] = useState(false);
  return (
    <Container>
      <Timer remainedTime={props.remainedTime} />
      <ScoreBoard score={props.score}></ScoreBoard>
      <Button text="Cancel" onClick={props.cancelGame} />
      {!paused ? (
        <Button
          text="Pause"
          onClick={() => {
            if (gameActive) {
              setPaused(true);
              props.pauseGame();
            }
          }}
        />
      ) : (
        <Button
          text="Restart"
          onClick={() => {
            setPaused(false);
            props.restartGame();
          }}
        />
      )}
    </Container>
  );
};

export { Bar };
