import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../../constants";
import { Button } from "../Button";
import { font, bg } from "../../style/sharedStyle";
const ResultContainer = styled.div`
  position: relative;
  display: flex;
  width: 30%;
  height: 10rem;
  left: calc(35%);
  border: none;
  box-sizing: border-box;
  ${bg.lightGreen};
  ${font.white}
  outline: none;
  &:hover {
    cursor: pointer;
  }

  @media only screen and ${device.xs} {
    height: 2rem;
  }
`;

const ScoreContainer = styled.div`
  position: absolute;
  display: flex;

  border-radius: 2px;
  border: none;
  box-sizing: border-box;
  ${bg.pinky};
  ${font.white}
  outline: none;
  &:hover {
    cursor: pointer;
  }

  @media only screen and ${device.xs} {
    height: 2rem;
  }
`;

const Result = memo((props) => {
  return (
    <ResultContainer>
      <ScoreContainer>Winner, name score,{props.winner} </ScoreContainer>
      <Button text="Play Again" onClick={props.playAgain}></Button>
    </ResultContainer>
  );
});

export { Result };
