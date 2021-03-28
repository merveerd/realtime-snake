import React from "react";
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
  return (
    <BarContainer>
      <Timer remainedTime={props.remainedTime} />
      <ScoreBoard score={props.score}></ScoreBoard>
      <Button text="Cancel" onClick={props.cancelGame} />
    </BarContainer>
  );
};

export { Bar };
