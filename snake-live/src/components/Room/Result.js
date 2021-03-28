import React, { memo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "../Button";
import { font, fontSize } from "../../style/sharedStyle";

const ResultContainer = styled.div`
  position: absolute;
  display: flex;
  width: 30%;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 10rem;
  ${fontSize.lrg}
  ${font.lightPurple}
`;

const Result = memo((props) => {
  const room = useSelector((state) => state.roomResponse);
  const { playerNumber, score } = room;

  //berabere issuesu var . SCORES not score
  const SortedScore = () => {
    score.map((item) => {
      return (
        <p>
          User {`${item.userName}`}!, score:{`${item.score}`}
        </p>
      );
    });
  };
  const ScoreTable = () => {
    score.sort((a, b) => (a.score > b.score ? 1 : b.score > a.score ? -1 : 0));
    //score.sort((a, b) => a.score.localeCompare(b.score));

    if (playerNumber === 2) {
      return (
        <>
          {score[0] !== score[1] ? (
            <p>Winner is User {`${score[0].userName}`}!,</p>
          ) : (
            <p>Draw!,</p>
          )}
          <SortedScore />
        </>
      );
    } else {
      return <p>Your score: {`${score[0].score}`}</p>;
    }
  };

  return (
    <ResultContainer>
      <ScoreTable />
      <Button
        style={{ height: "30%" }}
        text="Play Again"
        onClick={props.playAgain}
      ></Button>
    </ResultContainer>
  );
});

export { Result };
