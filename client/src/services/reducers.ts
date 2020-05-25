import { combineReducers, Action } from "redux";
import langueReducer from "./Reducers/langueReducer";
import dispositifReducer from "./Reducers/dispositifReducer";
import structureReducer from "./Reducers/structureReducer";
import userReducer from "./User/user.reducer";
import ttsReducer from "./Reducers/ttsReducer";

const appReducer = combineReducers({
  langue: langueReducer,
  dispositif: dispositifReducer,
  user: userReducer,
  tts: ttsReducer,
  structure: structureReducer,
});

type RootReducer = ReturnType<typeof appReducer>;

export const rootReducer = (state: any, action: Action): RootReducer =>
  appReducer(state, action);
