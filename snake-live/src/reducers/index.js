import { combineReducers } from "redux";
import RoomReducer from "./RoomReducer";

export default combineReducers({
  roomResponse: RoomReducer,
});
