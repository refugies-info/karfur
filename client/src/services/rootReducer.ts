import { combineReducers, Action } from "redux";
import langueReducer from "./Reducers/langueReducer";
import dispositifReducer from "./Reducers/dispositifReducer";
import structureReducer from "./Reducers/structureReducer";
import { userReducer, UserState } from "./User/user.reducer";
import ttsReducer from "./Reducers/ttsReducer";

// TO DO type correctly when refacto stores
type LangueState = any;
type DispositifState = any;
type TtsState = any;
type StructureState = any;

export interface RootState {
  user: UserState;
  langue: LangueState;
  dispositif: DispositifState;
  tts: TtsState;
  structure: StructureState;
}
const appReducer = combineReducers({
  langue: langueReducer,
  dispositif: dispositifReducer,
  user: userReducer,
  tts: ttsReducer,
  structure: structureReducer,
});

type RootReducer = ReturnType<typeof appReducer>;

export const rootReducer = (
  state: RootState | undefined,
  action: Action
): RootReducer => appReducer(state, action);
