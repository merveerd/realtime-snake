import { SET_ROOM_INFO, CHANGE_GAME_STATUS } from "../actions/types";

const INITIAL_STATE = {
  gridNumber: "",
  playerNumber: 0,
  gameActive: true,
  winner: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ROOM_INFO: {
      const gridNumber = action.payload.gridNumber;
      const playerNumber = action.payload.playerNumber;
      return { ...state, playerNumber, gridNumber };
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
