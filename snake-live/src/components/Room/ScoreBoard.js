import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../../constants";
import { font, bg, fontSize } from "../../style/sharedStyle";
const Board = styled.div`
  width: auto;
  height: 20%;
  border-radius: 3%;
  ${fontSize.sm};
  border: 5px solid #ffffff;
  box-sizing: border-box;
  ${bg.lightPurple};
  ${font.white};
  margin: 1%;
  padding: 1%;
  @media only screen and ${device.xs} {
    height: 2rem;
  }
`;

const ScoreBoard = memo((props) => {
  return <Board>1. User: {props.score}</Board>;
});

export { ScoreBoard };
