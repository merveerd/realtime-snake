import React, { memo } from "react";
import styled from "styled-components";
import { device } from "../constants";
import { font, bg } from "../style/sharedStyle";
const StyledInput = styled.input`
  width: 10%;
  height: 1.3rem;
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

const Input = memo((props) => {
  return <StyledInput placeholder={props.placeholder}></StyledInput>;
});

export { Input };
