import React, { useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Input } from "../components";

import { SocketContext } from "../socketClient";
import { changeGameStatus, setRoomInfo } from "../actions";

const Main = (props) => {
  const history = useHistory();
  const socket = useContext(SocketContext);
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

  return (
    <div>
      <Button text=" Single Player Game Start" onClick={newGame} />
      <Button text="Two Player Game Start" onClick={newGame} />
      <Input placeholder="Enter Game Code"></Input>
      {/* <Button text="Join game" onClick={joinGame} />
      {gameCode && ( //in Two Player Game Start
        <h1>
          Game code to join: <GameCodeDisplay>{gameCode}</GameCodeDisplay>
        </h1>
      )} */}
    </div>
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
