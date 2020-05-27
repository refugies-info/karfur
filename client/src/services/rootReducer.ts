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
import { connectRouter } from "connected-react-router";

export interface RootState {
  user: UserState;
  langue: LangueState;
  dispositif: DispositifState;
  tts: TtsState;
  structure: StructureState;
}
export const appReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    langue: langueReducer,
    dispositif: dispositifReducer,
    user: userReducer,
    tts: ttsReducer,
    structure: structureReducer,
  });
