import { combineReducers } from "redux";
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
import { translationReducer, TranslationState } from "./Translation/translation.reducer";
import { ttsReducer, TtsState } from "./Tts/tts.reducer";
import { connectRouter } from "connected-react-router";
import {
  SelectedDispositifState,
  selectedDispositifReducer,
} from "./SelectedDispositif/selectedDispositif.reducer";
import {
  LoadingStatusState,
  loadingStatusReducer,
} from "./LoadingStatus/loadingStatus.reducer";

export interface RootState {
  user: UserState;
  langue: LangueState;
  dispositif: DispositifState;
  tts: TtsState;
  structure: StructureState;
  selectedDispositif: SelectedDispositifState;
  loadingStatus: LoadingStatusState;
  translation: TranslationState;
}
export const appReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    langue: langueReducer,
    dispositif: dispositifReducer,
    user: userReducer,
    tts: ttsReducer,
    structure: structureReducer,
    selectedDispositif: selectedDispositifReducer,
    loadingStatus: loadingStatusReducer,
    translation: translationReducer
  });
