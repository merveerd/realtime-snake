import React, { memo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { font, bg, fontSize } from "../../style/sharedStyle";
const Board = styled.div`
  width: 20%;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3%;
  ${fontSize.sm};
  border: 5px solid #ffffff;
  ${bg.lightPurple};
  ${font.white};
  margin: 1%;
  padding: 1%;
`;
const Score = styled.div`
  ${fontSize.sm};
  ${font.white};
  margin: 1%;
`;
const Title = styled.p`
  width: auto;
  ${fontSize.md};
  ${font.white};
  margin: 1%;
`;

const ScoreBoard = memo((props) => {
  const playerNumber = useSelector((state) => state.roomResponse.playerNumber);
  const score = useSelector((state) => state.roomResponse.score);

  return (
    <Board>
      <Title>Scoreboard</Title>
      {playerNumber === 1 ? (
        <Score> {score[0].score}</Score>
      ) : (
        <>
          <Score>1.User: {score[0].score}</Score>
          <Score>2.User: {score[1].score}</Score>
        </>
      )}
    </Board>
  );
});

export { ScoreBoard };
