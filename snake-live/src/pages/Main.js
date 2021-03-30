import React, { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components";
import { SocketContext } from "../socketClient";
import { changeGameStatus, setRoomInfo, setUserId } from "../actions";
import { font, bg } from "../style/sharedStyle";
import { Container } from "../components/StyledContainer";
const MainContainer = styled(Container)`
  height: 100vh;
  flex-direction: column;
  ${bg.pinky};
  ${font.white}
`;

const Main = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const [inviteUrl, setInviteUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const startGame = (state) => {
    setInviteUrl(null);
    if (state) {
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
      history.push(`${state.gameId}`);
    } else {
      history.push("");
    }
  };

  useEffect(() => {
    socket.on("joined", startGame);
    socket.on("start", startGame);
    return () => {
      socket.off("joined", startGame);
      socket.off("gameUrl", showInviteUrl);
      socket.off("start", startGame);
    };
  }, []);

  const showInviteUrl = (url) => {
    setInviteUrl(url);
  };

  const newSingleGame = () => {
    socket.emit("newSingleGame");
    dispatch(setUserId(1));
  };

  const newTwoPlayerGame = () => {
    socket.emit("newTwoPlayerGame");
    socket.on("gameUrl", showInviteUrl);
    dispatch(setUserId(1));
  };

  const copyToClipBoard = async (e) => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      e.target.focus();
      setCopySuccess("Copied!");
      setTimeout(() => {
        setCopySuccess("");
      }, 1000);
      //
    } catch (err) {
      setCopySuccess("Couldn't copied!");
      console.log(err);
    }
  };

  return (
    <MainContainer>
      <Container>
        <Button text=" Single Player" onClick={newSingleGame} />
        <Button text="Two Player" onClick={newTwoPlayerGame} />
      </Container>
      {}
      {inviteUrl && (
        <h3 style={{ cursor: "pointer" }} onClick={copyToClipBoard}>
          Invite Link, click to copy: {inviteUrl}
          <br></br>Waiting for the second player
        </h3>
      )}
      {copySuccess}
    </MainContainer>
  );
};

Main.propTypes = {
  inviteUrl: PropTypes.string,
  copySuccess: PropTypes.string,
  setRoomInfo: PropTypes.func,
};
export default Main;
