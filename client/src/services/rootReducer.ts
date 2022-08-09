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
import { needsReducer, NeedsState } from "./Needs/needs.reducer";
import { widgetsReducer, WidgetsState } from "./Widgets/widgets.reducer";
import { themesReducer, ThemesState } from "./Themes/themes.reducer";
import { HYDRATE } from "next-redux-wrapper"
import { Reducer } from "typesafe-actions";

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
  needs: NeedsState;
  themes: ThemesState;
  widgets: WidgetsState;
}

const combinedReducer = combineReducers({
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
  needs: needsReducer,
  themes: themesReducer,
  widgets: widgetsReducer,
});

export const appReducer: Reducer<any, any> = (state, action) => {
  if (action.type === HYDRATE) { // action sent the Next with the server side data
    const nextState = { ...state };

    // add to store if not already in
    if (action.payload.activeDispositifs.length > 0 && nextState.activeDispositifs.length === 0) {
      nextState.activeDispositifs = action.payload.activeDispositifs;
    }
    if (action.payload.activeStructures.length > 0 && nextState.activeStructures.length === 0) {
      nextState.activeStructures = action.payload.activeStructures;
    }
    if (action.payload.selectedDispositif) {
      nextState.selectedDispositif = action.payload.selectedDispositif;
    }
    if (action.payload.selectedStructure) {
      nextState.selectedStructure = action.payload.selectedStructure;
    }
    if (action.payload.langue.langues.length > 0 && nextState.langue.langues.length === 0) {
      nextState.langue = action.payload.langue;
    }
    if (action.payload.themes.length > 0 && nextState.themes.length === 0) {
      nextState.themes = action.payload.themes;
    }
    return nextState;
  }
  return combinedReducer(state, action);
};
