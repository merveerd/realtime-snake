import { ADD_ROOMID } from "../actions/types";

const INITIAL_STATE = {
  roomId: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_ROOMID: {
      const roomId = action.payload.roomId;
      return { ...state, roomId };
    }

    default:
      return state;
  }
};
