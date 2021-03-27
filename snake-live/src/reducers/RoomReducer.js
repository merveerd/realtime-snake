import { SET_ROOM_INFO, SET_SCORE, CHANGE_GAME_STATUS } from "../actions/types";

const INITIAL_STATE = {
  gridNumber: "",
  playerNumber: 0,
  gameActive: true,
  winner: "",
  score: {
    1: 0,
    2: 0,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ROOM_INFO: {
      const gridNumber = action.payload.gridNumber;
      const playerNumber = action.payload.playerNumber;
      return { ...state, playerNumber, gridNumber };
    }

    case SET_SCORE: {
      const score = action.payload;
      return { ...state, score };
    }

    case CHANGE_GAME_STATUS: {
      const gameActive = action.payload.gameActive;
      const winner = action.payload.winner;
      return { ...state, gameActive: gameActive, winner };
    }

    default:
      return state;
  }
};
