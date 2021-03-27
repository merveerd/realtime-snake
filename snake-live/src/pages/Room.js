import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Button, GameBoard, Result, ScoreBoard } from "../components";
import { changeGameStatus, setScore } from "../actions";

const BarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RoomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Room = (props) => {
  const { winner, playerNumber, score, setScore, changeGameStatus } = props;
  const history = useHistory();
  const socket = useContext(SocketContext);

  const handleGameOver = (data) => {
    data = JSON.parse(data);
    const gameStatus = {
      gameActive: false,
      winner: data.winner,
    };
    changeGameStatus(gameStatus);
  };

  useEffect(() => {
    socket.on("gameOver", handleGameOver);

    // unsubscribe from event for preventing memory leaks
    return () => {
      socket.off("gameOver", handleGameOver);
    };
  }, []);

  const playAgain = () => {
    //1,2,3 start animation
    const gameStatus = {
      gameActive: true,
      winner: "",
    };
    changeGameStatus(gameStatus);
    socket.emit("newGame");
  };

  return (
    <RoomContainer>
      <BarContainer>
        <ScoreBoard score={score["1"]}></ScoreBoard>
        <Button
          text="Cancel"
          onClick={() => {
            history.push("");
          }}
        />
      </BarContainer>
      <GameBoard setScore={setScore} />

      {winner && (
        <Result
          playerNumber={playerNumber}
          winner={winner}
          score={score}
          playAgain={playAgain}
        ></Result>
      )}
    </RoomContainer>
  );
};

const mapDispatchToProps = {
  changeGameStatus,
  setScore,
};

const mapStateToProps = ({ roomResponse }) => {
  const { winner, score, playerNumber } = roomResponse;

  return {
    winner,
    score,
    playerNumber,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Room);
