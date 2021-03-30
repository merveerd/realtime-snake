import React, { memo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "../Button";
import { font, fontSize } from "../../style/sharedStyle";

const ResultContainer = styled.div`
  position: absolute;
  display: flex;
  width: 30%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 10rem;
  font-weight: bold;
  ${fontSize.lrg}
  ${font.lightPurple}
`;

const Result = memo((props) => {
  const room = useSelector((state) => state.roomResponse);
  const { playerNumber, score } = room;

  //berabere issuesu var . SCORES not score
  const SortedScore = (props) => {
    return score.map((item, index) => {
      return (
        <p key={index} style={{ margin: 0 }}>
          User {`${item.userName}`} score:{`${item.score}`}
        </p>
      );
    });
  };
  const ScoreTable = () => {
    score.sort((a, b) => (a.score < b.score ? 1 : b.score < a.score ? -1 : 0));
    //score.sort((a, b) => a.score.localeCompare(b.score));

    if (playerNumber === 2) {
      return (
        <>
          {score[0].score !== score[1].score ? (
            <p>Winner is User {`${score[0].userName}`}!</p>
          ) : (
            <p>Draw!</p>
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
Result.propTypes = {
  score: PropTypes.array,
};
export { Result };
