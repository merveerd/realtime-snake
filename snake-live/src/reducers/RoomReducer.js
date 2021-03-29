import {
  SET_USER_ID,
  SET_ROOM_INFO,
  SET_SCORE,
  CHANGE_GAME_STATUS,
} from "../actions/types";

const INITIAL_STATE = {
  gameId: "",
  gridNumber: "",
  playerNumber: 0,
  userId: "",
  gameActive: false,
  roomActive: false,
  score: [{ 1: 0 }, { 2: 0 }],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ROOM_INFO: {
      const gridNumber = action.payload.gridNumber;
      const playerNumber = action.payload.playerNumber;
      const gameId = action.payload.gameId;
      return { ...state, playerNumber, gridNumber, gameId };
    }

    case SET_SCORE: {
      const score = action.payload;
      return { ...state, score };
    }
    case SET_USER_ID: {
      const userId = action.payload;
      return { ...state, userId };
    }

    case CHANGE_GAME_STATUS: {
      const gameActive = action.payload.gameActive;
      const roomActive = action.payload.roomActive;
      return { ...state, gameActive, roomActive };
    }

    default:
      return state;
  }
};
