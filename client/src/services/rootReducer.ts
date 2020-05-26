import { combineReducers, Action } from "redux";
import { langueReducer, LangueState } from "./Langue/langue.reducer";
import {
  dispositifReducer,
  DispositifState,
} from "./Dispositif/dispositif.reducer";
import {
  structureReducer,
  StructureState,
} from "./Structures/structures.reducer";
import { userReducer, UserState } from "./User/user.reducer";
import { ttsReducer, TtsState } from "./Tts/tts.reducer";

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
