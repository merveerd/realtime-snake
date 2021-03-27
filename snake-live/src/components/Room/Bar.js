import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../Button";
import { ScoreBoard } from "./ScoreBoard";

const BarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bar = memo((props) => {
  const history = useHistory();
  return (
    <BarContainer>
      <ScoreBoard score={props.score}></ScoreBoard>
      <Button
        text="Cancel"
        onClick={() => {
          history.push("");
        }}
      />
    </BarContainer>
  );
});

export { Bar };
