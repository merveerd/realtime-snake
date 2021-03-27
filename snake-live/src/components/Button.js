import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../constants";
import { font, bg, fontSize } from "../style/sharedStyle";
const StyledButton = styled.button`
  width: 10%;
  height: auto;
  border-radius: 3%;
  ${fontSize.md};
  border: 5px solid #ffffff;
  box-sizing: border-box;
  ${bg.lightPurple};
  ${font.white};
  margin: 1%;
  padding: 1%;
  outline: none;
  &:hover {
    cursor: pointer;
  }

  @media only screen and ${device.xs} {
    height: 2rem;
  }
`;

const Button = memo((props) => {
  return <StyledButton onClick={props.onClick}>{props.text}</StyledButton>;
});

export { Button };
