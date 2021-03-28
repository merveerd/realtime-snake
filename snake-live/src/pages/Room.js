import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Bar, GameBoard, Result } from "../components";
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
  const [time, setTime] = useState(180);

  const handleGameOver = (data) => {
    data = JSON.parse(data);
    const gameStatus = {
      gameActive: false,
      winner: data.winner,
    };
    changeGameStatus(gameStatus);
  };

  const setTimer = (s) => {
    setTime(s);
  };

  useEffect(() => {
    socket.on("gameOver", handleGameOver);
    socket.on("timer", setTimer);
    // unsubscribe from event for preventing memory leaks
    return () => {
      socket.off("gameOver", handleGameOver);
      socket.off("timer", setTimer);
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
  const cancelGame = () => {
    history.push("");
    socket.emit("cancelGame", true);
  };

  return (
    <RoomContainer>
      <Bar cancelGame={cancelGame} remainedTime={time}></Bar>
      <GameBoard setScore={setScore} />

      {winner && <Result playAgain={playAgain}></Result>}
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
