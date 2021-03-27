import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../constants";
import { font, bg, fontSize } from "../style/sharedStyle";
const StyledButton = styled.button`
  height: auto;
  align-self: center;
  border-radius: 3%;
  ${fontSize.sm};
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
  return (
    <StyledButton style={props.style} onClick={props.onClick}>
      {props.text}
    </StyledButton>
  );
});

export { Button };
