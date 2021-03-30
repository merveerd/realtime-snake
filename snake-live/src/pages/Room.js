import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Bar, GameBoard, Result } from "../components";
import { changeGameStatus, setScore, setRoomInfo } from "../actions";
import { bg } from "../style/sharedStyle";
import { Container } from "../components/StyledContainer";

const RoomContainer = styled(Container)`
  flex-direction: column;
  ${bg.whitesmoke};
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
    if (state) {
      setTime(180);
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
    } else {
      history.push(""); //non valid url pop up for that
    }
  };

  const handleCancel = (data) => {
    dispatch(changeGameStatus({ gameActive: false, roomActive: false }));
    history.push("");
  };

  useEffect(() => {
    socket.on("timeOver", handleTimeOver);
    socket.on("timer", setTimer);
    socket.on("joined", startGame);
    socket.on("start", startGame);
    socket.on("canceled", handleCancel);
    socket.on("tooManyPlayers", () => {
      history.push("");
    });
    socket.on("unknownCode", () => {
      history.push("");
    });
    return () => {
      socket.off("timeOver", handleTimeOver);
      socket.off("timer", setTimer);
      socket.off("joined", startGame);
      socket.off("start", startGame);
      socket.off("canceled", handleCancel);
      socket.off("tooManyPlayers", () => {
        history.push("");
      });
      socket.off("unknownCode", () => {
        history.push("");
      });
    };
  }, []);

  const playAgain = () => {
    socket.emit("playAgain", gameId);
  };
  const cancelGame = () => {
    socket.emit("cancelGame", gameId);
  };
  const pauseGame = () => {
    socket.emit("pauseGame", gameId);
  };

  const restartGame = () => {
    socket.emit("restartGame", gameId);
  };
  return (
    <RoomContainer>
      <Bar
        restartGame={restartGame}
        cancelGame={cancelGame}
        pauseGame={pauseGame}
        remainedTime={time}
      ></Bar>
      <GameBoard setScore={setScore} />

      {!gameActive && <Result playAgain={playAgain}></Result>}
    </RoomContainer>
  );
};

export default Room;
