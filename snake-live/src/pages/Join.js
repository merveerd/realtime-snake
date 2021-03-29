import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "../components";
import { SocketContext } from "../socketClient";
import { changeGameStatus, setUserId, setRoomInfo } from "../actions";
import { font, bg } from "../style/sharedStyle";
import Room from "./Room";

const JoinContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  ${bg.pinky};
  ${font.white}
`;

const Join = (props) => {
  const index = window.location.href.lastIndexOf("/");
  const gameId = window.location.href.substr(index + 1); //getting gameId from Url
  const roomActive = useSelector((state) => state.roomResponse.roomActive);

  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("joined", startGame);
    return () => {
      socket.off("joined", startGame);
    };
  }, []);

  const startGame = (state) => {
    // history.push("room");

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

  const dispatch = useDispatch();

  const JoinGame = () => {
    dispatch(setUserId(2));
    socket.emit("secondJoined", gameId);
  };

  return (
    <>
      {roomActive ? (
        <Room />
      ) : (
        <JoinContainer>
          <Button text=" Join The Game" onClick={JoinGame} />
        </JoinContainer>
      )}
    </>
  );
};
export default Join;
