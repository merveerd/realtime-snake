import { SET_SCORE, SET_ROOM_INFO, CHANGE_GAME_STATUS } from "./types";

export const setRoomInfo = (roomInfo) => ({
  type: SET_ROOM_INFO,
  payload: roomInfo,
});

export const setScore = (score) => {
  return {
    type: SET_SCORE,
    payload: score,
  };
};

export const changeGameStatus = (gameStatus) => {
  return {
    type: CHANGE_GAME_STATUS,
    payload: gameStatus,
  };
};
