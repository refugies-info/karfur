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
import {
  AllStructuresState,
  allStructuresReducer,
} from "./AllStructures/allStructures.reducer";
import { AllUsersState, allUsersReducer } from "./AllUsers/allUsers.reducer";
import {
  UserFavoritesState,
  userFavoritesReducer,
} from "./UserFavoritesInLocale/UserFavoritesInLocale.reducer";
import {
  UserContributionsState,
  userContributionsReducer,
} from "./UserContributions/userContributions.reducer";
import {
  DispositifsWithTranslationsStatusState,
  dispositifsWithTranslationsStatusReducer,
} from "./DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.reducer";

export interface RootState {
  user: UserState;
  langue: LangueState;
  activeDispositifs: ActiveDispositifsState;
  tts: TtsState;
  userStructure: UserStructureState;
  selectedDispositif: SelectedDispositifState;
  loadingStatus: LoadingStatusState;
  translation: TranslationState;
  activeStructures: ActiveStructuresState;
  selectedStructure: SelectedStructureState;
  allDispositifs: AllDispositifsState;
  allStructures: AllStructuresState;
  users: AllUsersState;
  userFavorites: UserFavoritesState;
  userContributions: UserContributionsState;
  dispositifsWithTranslations: DispositifsWithTranslationsStatusState;
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
    allStructures: allStructuresReducer,
    users: allUsersReducer,
    userFavorites: userFavoritesReducer,
    userContributions: userContributionsReducer,
    dispositifsWithTranslations: dispositifsWithTranslationsStatusReducer,
  });
