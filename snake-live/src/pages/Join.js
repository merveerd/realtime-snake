import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "../components";
import { SocketContext } from "../socketClient";
import { setUserId, changeGameStatus } from "../actions";
import { font, bg } from "../style/sharedStyle";
import Room from "../components/Room/Room";
import { Container } from "../components/StyledContainer";
const JoinContainer = styled(Container)`
  height: 100vh;
  flex-direction: column;
  ${bg.pinky};
  ${font.white}
`;

const Join = (props) => {
  const index = window.location.href.lastIndexOf("/");
  const gameId = window.location.href.substr(index + 1); //getting gameId from Url
  const roomActive = useSelector((state) => state.roomResponse.roomActive);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const JoinGame = () => {
    dispatch(changeGameStatus({ gameActive: true, roomActive: true }));
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

Join.propTypes = {
  roomActive: PropTypes.bool,
  setUserId: PropTypes.func,
  changeGameStatus: PropTypes.func,
};

export default Join;
