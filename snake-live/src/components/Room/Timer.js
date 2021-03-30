import React from "react";
import styled from "styled-components";
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
`;

const Timer = (props) => {
  const remainedTime = `${Math.floor(props.remainedTime / 60)}:${(
    props.remainedTime % 60
  ).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
  return <Board>{remainedTime}</Board>;
};

export { Timer };
