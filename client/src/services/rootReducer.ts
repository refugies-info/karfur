import { combineReducers } from "redux";
import { langueReducer, LangueState } from "./Langue/langue.reducer";
import {
  dispositifReducer,
  DispositifState,
} from "./Dispositif/dispositif.reducer";
import {
  structureReducer,
  StructureState,
} from "./Structure/structure.reducer";
import { userReducer, UserState } from "./User/user.reducer";
import {
  translationReducer,
  TranslationState,
} from "./Translation/translation.reducer";
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
import {
  StructuresState,
  structuresReducer,
} from "./Structures/structures.reducer";

export interface RootState {
  user: UserState;
  langue: LangueState;
  dispositif: DispositifState;
  tts: TtsState;
  structure: StructureState;
  selectedDispositif: SelectedDispositifState;
  loadingStatus: LoadingStatusState;
  translation: TranslationState;
  structures: StructuresState;
}
export const appReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    langue: langueReducer,
    dispositif: dispositifReducer,
    user: userReducer,
    tts: ttsReducer,
    // structure should not be used, we should not need all data from all structures in front
    structure: structureReducer,
    selectedDispositif: selectedDispositifReducer,
    loadingStatus: loadingStatusReducer,
    translation: translationReducer,
    structures: structuresReducer,
  });
