import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../Button";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";

const BarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bar = (props) => {
  const [paused, setPaused] = useState(false);
  return (
    <BarContainer>
      <Timer remainedTime={props.remainedTime} />
      <ScoreBoard score={props.score}></ScoreBoard>
      <Button text="Cancel" onClick={props.cancelGame} />
      {!paused ? (
        <Button
          text="Pause"
          onClick={() => {
            setPaused(true);
            props.pauseGame();
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
    </BarContainer>
  );
};

export { Bar };
