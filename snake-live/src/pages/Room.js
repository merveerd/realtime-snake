import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../socketClient";
import { Button, GameBoard, Result } from "../components";
import { changeGameStatus } from "../actions";

const Room = (props) => {
  const { winner, changeGameStatus } = props;
  const history = useHistory();
  const socket = useContext(SocketContext);

  const handleGameOver = (data) => {
    data = JSON.parse(data);
    const gameStatus = {
      gameActive: false,
      winner: data.winner,
    };
    changeGameStatus(gameStatus);
  };

  useEffect(() => {
    socket.on("gameOver", handleGameOver);

    // unsubscribe from event for preventing memory leaks
    return () => {
      socket.off("gameOver", handleGameOver);
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

  return (
    <div>
      <Button
        text="cancel"
        onClick={() => {
          history.push("");
        }}
      />
      <GameBoard />
      {winner && <Result winner={winner} playAgain={playAgain}></Result>}
    </div>
  );
};

const mapDispatchToProps = {
  changeGameStatus,
};

const mapStateToProps = ({ roomResponse }) => {
  const { winner } = roomResponse;

  return {
    winner,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Room);
