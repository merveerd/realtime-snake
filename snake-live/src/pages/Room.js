import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Bar, GameBoard, Result } from "../components";
import { changeGameStatus, setScore, setRoomInfo } from "../actions";
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
  const room = useSelector((state) => state.roomResponse);
  const { gameActive, gameId } = room;
  const dispatch = useDispatch();
  const history = useHistory();
  const socket = useContext(SocketContext);
  const [time, setTime] = useState(180);

  const handleTimeOver = (data) => {
    dispatch(changeGameStatus({ gameActive: false, roomActive: true }));
  };

  const setTimer = (s) => {
    setTime(s);
  };

  const startGame = (state) => {
    dispatch(
      setRoomInfo({
        gameId: state.gameId,
        playerNumber: state.playerNumber,
        gridNumber: state.gridNumber,
      })
    );
    dispatch(
      changeGameStatus({
        gameActive: true,
        roomActive: true,
      })
    );
  };

  const handleCancel = (counter) => {
    dispatch(changeGameStatus({ gameActive: false, roomActive: false }));
    history.push("");
  };

  useEffect(() => {
    socket.on("timeOver", handleTimeOver);
    socket.on("timer", setTimer);
    socket.on("joined", startGame);
    socket.on("start", startGame);
    socket.on("canceled", handleCancel);

    return () => {
      socket.off("timeOver", handleTimeOver);
      socket.off("timer", setTimer);
      socket.off("joined", startGame);
      socket.off("start", startGame);
      socket.off("canceled", handleCancel);
    };
  }, []);

  const playAgain = () => {
    socket.emit("playAgain", gameId);
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

export default Room;
