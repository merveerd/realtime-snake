import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Input } from "../components";
import { SocketContext } from "../socketClient";
import { changeGameStatus, setRoomInfo } from "../actions";
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
  const [openInput, setOpenInput] = useState(null);
  const [gameCode, setGameCode] = useState(null);

  const newGame = () => {
    props.changeGameStatus({ gameActive: true });
    socket.emit("newGame");
    socket.on("init", handleInit);
    history.push("room");
  };

  const handleInit = (state) => {
    props.setRoomInfo({
      playerNumber: state.playerNumber,
      gridNumber: state.gridNumber,
    }); //any other info too
  };

  const enterCode = () => {
    setOpenInput(true);
  };
  return (
    <MainContainer>
      <NewGameContainer>
        <Button text=" Single Player" onClick={newGame} />
        <Button text="Two Player" onClick={newGame} />
      </NewGameContainer>

      {openInput ? (
        <h1>
          Enter Code : <Input placeholder="Code"></Input>
        </h1>
      ) : (
        <Button text="Join Game" onClick={enterCode}></Button>
      )}
      {/* {gameCode && ( //in Two Player Game
        <h1>
          Game code to join: <GameCodeDisplay>{gameCode}</GameCodeDisplay>
        </h1>
      )} */}
    </MainContainer>
  );
};

const mapDispatchToProps = {
  changeGameStatus,
  setRoomInfo,
};
const mapStateToProps = ({ roomResponse }) => {
  const { gameActive } = roomResponse;

  return {
    gameActive,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
