import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Bar, GameBoard, Result } from "../components";
import { changeGameStatus, setScore } from "../actions";
import { bg } from "../style/sharedStyle";
const RoomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${bg.darkGray};
`;

const Room = (props) => {
  const { gameActive, setScore, changeGameStatus, gameId } = props;
  const history = useHistory();
  const socket = useContext(SocketContext);
  const [time, setTime] = useState(180);

  const handleTimeOver = (data) => {
    // data = JSON.parse(data);

    changeGameStatus({ gameActive: false, roomActive: true });
  };

  const setTimer = (s) => {
    setTime(s);
  };

  const handleCancel = (counter) => {
    changeGameStatus({ gameActive: false, roomActive: false });
    history.push("");
  };

  useEffect(() => {
    socket.on("timeOver", handleTimeOver);
    socket.on("timer", setTimer);

    socket.on("canceled", handleCancel);

    // unsubscribe from event for preventing memory leaks
    return () => {
      socket.off("timeOver", handleTimeOver);
      socket.off("timer", setTimer);
      socket.off("canceled", handleCancel);
    };
  }, []);

  const playAgain = () => {
    //1,2,3 start animation
    changeGameStatus({ gameActive: true, roomActive: true });
    //socket.emit("playAgain");
  };
  const cancelGame = () => {
    socket.emit("cancelGame", gameId);
  };

  return (
    <RoomContainer>
      <Bar cancelGame={cancelGame} remainedTime={time}></Bar>
      <GameBoard setScore={setScore} />

      {!gameActive && <Result playAgain={playAgain}></Result>}
    </RoomContainer>
  );
};

const mapDispatchToProps = {
  changeGameStatus,
  setScore,
};

const mapStateToProps = ({ roomResponse }) => {
  const { gameActive, gameId } = roomResponse;

  return {
    gameActive,
    gameId,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Room);
