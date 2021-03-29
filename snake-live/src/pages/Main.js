import React, { useContext, useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Input } from "../components";
import { SocketContext } from "../socketClient";
import { changeGameStatus, setRoomInfo, setUserId } from "../actions";
import { font, bg } from "../style/sharedStyle";

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  ${bg.pinky};
  ${font.white}
`;

const NewGameContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main = (props) => {
  const history = useHistory();
  const socket = useContext(SocketContext);
  const [inviteUrl, setInviteUrl] = useState(null);

  const startGame = (state) => {
    setInviteUrl(null);
    props.setRoomInfo({
      gameId: state.gameId,
      playerNumber: state.playerNumber,
      gridNumber: state.gridNumber,
    });
    props.changeGameStatus({ gameActive: true, roomActive: true });
    history.push(`${state.gameId}`);
  };

  useEffect(() => {
    socket.on("joined", startGame);

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
    socket.on("start", startGame);
    props.setUserId(1);
  };

  const newTwoPlayerGame = () => {
    socket.emit("newTwoPlayerGame");
    socket.on("gameUrl", showInviteUrl);
    props.setUserId(1);
  };

  return (
    <MainContainer>
      <NewGameContainer>
        <Button text=" Single Player" onClick={newSingleGame} />
        <Button text="Two Player" onClick={newTwoPlayerGame} />
      </NewGameContainer>
      {}
      {inviteUrl && (
        <h3>
          Invite Link: {inviteUrl}
          <br></br>Waiting for the second player
        </h3>
      )}
    </MainContainer>
  );
};

const mapDispatchToProps = {
  changeGameStatus,
  setRoomInfo,
  setUserId,
};
const mapStateToProps = ({ roomResponse }) => {
  const { gameActive, playerNumber } = roomResponse;

  return {
    gameActive,
    playerNumber,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
