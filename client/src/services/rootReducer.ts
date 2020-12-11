import { combineReducers } from "redux";
import { langueReducer, LangueState } from "./Langue/langue.reducer";
import {
  activeDispositifsReducer,
  ActiveDispositifsState,
} from "./ActiveDispositifs/activeDispositifs.reducer";
import {
  structureReducer,
  UserStructureState,
} from "./UserStructure/userStructure.reducer";
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
  ActiveStructuresState,
  activeStructuresReducer,
} from "./ActiveStructures/activeStructures.reducer";
import {
  SelectedStructureState,
  selectedStructureReducer,
} from "./SelectedStructure/selectedStructure.reducer";
import {
  AllDispositifsState,
  allDispositifsReducer,
} from "./AllDispositifs/allDispositifs.reducer";

export interface RootState {
  user: UserState;
  langue: LangueState;
  activeDispositifs: ActiveDispositifsState;
  tts: TtsState;
  structure: UserStructureState;
  selectedDispositif: SelectedDispositifState;
  loadingStatus: LoadingStatusState;
  translation: TranslationState;
  activeStructures: ActiveStructuresState;
  selectedStructure: SelectedStructureState;
  allDispositifs: AllDispositifsState;
}
export const appReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    langue: langueReducer,
    activeDispositifs: activeDispositifsReducer,
    user: userReducer,
    tts: ttsReducer,
    userStructure: structureReducer,
    selectedDispositif: selectedDispositifReducer,
    loadingStatus: loadingStatusReducer,
    translation: translationReducer,
    activeStructures: activeStructuresReducer,
    selectedStructure: selectedStructureReducer,
    allDispositifs: allDispositifsReducer,
  });
