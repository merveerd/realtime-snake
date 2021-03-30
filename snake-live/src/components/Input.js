import React, { memo } from "react";
import styled from "styled-components";
import { font, bg, fontSize } from "../style/sharedStyle";
const StyledInput = styled.input`
  width: auto;
  height: auto;
  border-radius: 2px;
  border: none;
  box-sizing: border-box;
  display: flex;
  align-self: center;
  ${bg.pinky};
  ${font.white}
  ${fontSize.md};
  outline: none;
  &:hover {
    cursor: pointer;
  }
`;

const Input = memo((props) => {
  return <StyledInput placeholder={props.placeholder}></StyledInput>;
});

export { Input };
