import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../../constants";
import { Button } from "../Button";
import { font, bg, fontSize } from "../../style/sharedStyle";

const ResultContainer = styled.div`
  position: absolute;
  display: flex;
  width: 30%;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 10rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  border-radius: 2px;
  ${fontSize.md}
  ${font.lightPurple}
`;

const Result = memo((props) => {
  return (
    <ResultContainer>
      {props.playerNumber === 2 ? (
        <ScoreContainer>
          Winner is User{props.winner}!, score:{props.score[`${props.winner}`]}
        </ScoreContainer>
      ) : (
        <ScoreContainer>Your score: {props.score["1"]} </ScoreContainer>
      )}
      <Button
        style={{ height: "30%" }}
        text="Play Again"
        onClick={props.playAgain}
      ></Button>
    </ResultContainer>
  );
});

export { Result };
