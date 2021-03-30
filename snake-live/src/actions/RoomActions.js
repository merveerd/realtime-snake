import {
  SET_USER_ID,
  SET_SCORE,
  SET_ROOM_INFO,
  CHANGE_GAME_STATUS,
} from "./types";

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});

export const setRoomInfo = (roomInfo) => ({
  type: SET_ROOM_INFO,
  payload: roomInfo,
});

export const setScore = (score) => ({
  type: SET_SCORE,
  payload: score,
});

export const changeGameStatus = (gameStatus) => ({
  type: CHANGE_GAME_STATUS,
  payload: gameStatus,
});
