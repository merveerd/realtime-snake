import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SocketContext } from "../socketClient";
import { Button, GameBoard, Result, ScoreBoard } from "../components";
import { changeGameStatus } from "../actions";

const BarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RoomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
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
    <RoomContainer>
      <BarContainer>
        <ScoreBoard score={props.score}></ScoreBoard>
        <Button
          text="Cancel"
          onClick={() => {
            history.push("");
          }}
        />
      </BarContainer>
      <GameBoard />
      {winner && <Result winner={winner} playAgain={playAgain}></Result>}
    </RoomContainer>
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
