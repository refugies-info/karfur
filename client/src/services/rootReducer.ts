import { combineReducers } from "redux";
import { langueReducer, LangueState } from "./Langue/langue.reducer";
import { activeDispositifsReducer, ActiveDispositifsState } from "./ActiveDispositifs/activeDispositifs.reducer";
import { structureReducer, UserStructureState } from "./UserStructure/userStructure.reducer";
import { userReducer, UserState } from "./User/user.reducer";
import { translationReducer, TranslationState } from "./Translation/translation.reducer";
import { ttsReducer, TtsState } from "./Tts/tts.reducer";
import { SelectedDispositifState, selectedDispositifReducer } from "./SelectedDispositif/selectedDispositif.reducer";
import { LoadingStatusState, loadingStatusReducer } from "./LoadingStatus/loadingStatus.reducer";
import { ActiveStructuresState, activeStructuresReducer } from "./ActiveStructures/activeStructures.reducer";
import { ActiveUsersState, activeUsersReducer } from "./ActiveUsers/activeUsers.reducer";
import { SelectedStructureState, selectedStructureReducer } from "./SelectedStructure/selectedStructure.reducer";
import { AllDispositifsState, allDispositifsReducer } from "./AllDispositifs/allDispositifs.reducer";
import { AllStructuresState, allStructuresReducer } from "./AllStructures/allStructures.reducer";
import { AllUsersState, allUsersReducer } from "./AllUsers/allUsers.reducer";
import { UserFavoritesState, userFavoritesReducer } from "./UserFavoritesInLocale/UserFavoritesInLocale.reducer";
import { UserContributionsState, userContributionsReducer } from "./UserContributions/userContributions.reducer";
import {
  DispositifsWithTranslationsStatusState,
  dispositifsWithTranslationsStatusReducer
} from "./DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.reducer";
import { needsReducer, NeedsState } from "./Needs/needs.reducer";
import { widgetsReducer, WidgetsState } from "./Widgets/widgets.reducer";
import { themesReducer, ThemesState } from "./Themes/themes.reducer";
import { searchResultsReducer, SearchResultsState } from "./SearchResults/searchResults.reducer";
import { HYDRATE } from "next-redux-wrapper";
import { Reducer } from "typesafe-actions";
import { miscellaneousReducer, MiscellaneousState } from "./Miscellaneous/miscellaneous.reducer";

export interface RootState {
  activeDispositifs: ActiveDispositifsState;
  activeStructures: ActiveStructuresState;
  activeUsers: ActiveUsersState;
  allDispositifs: AllDispositifsState;
  allStructures: AllStructuresState;
  dispositifsWithTranslations: DispositifsWithTranslationsStatusState;
  langue: LangueState;
  loadingStatus: LoadingStatusState;
  miscellaneous: MiscellaneousState;
  needs: NeedsState;
  searchResults: SearchResultsState;
  selectedDispositif: SelectedDispositifState;
  selectedStructure: SelectedStructureState;
  themes: ThemesState;
  translation: TranslationState;
  tts: TtsState;
  user: UserState;
  userContributions: UserContributionsState;
  userFavorites: UserFavoritesState;
  users: AllUsersState;
  userStructure: UserStructureState;
  widgets: WidgetsState;
}

const combinedReducer = combineReducers({
  activeDispositifs: activeDispositifsReducer,
  activeStructures: activeStructuresReducer,
  activeUsers: activeUsersReducer,
  allDispositifs: allDispositifsReducer,
  allStructures: allStructuresReducer,
  dispositifsWithTranslations: dispositifsWithTranslationsStatusReducer,
  langue: langueReducer,
  loadingStatus: loadingStatusReducer,
  miscellaneous: miscellaneousReducer,
  needs: needsReducer,
  searchResults: searchResultsReducer,
  selectedDispositif: selectedDispositifReducer,
  selectedStructure: selectedStructureReducer,
  themes: themesReducer,
  translation: translationReducer,
  tts: ttsReducer,
  user: userReducer,
  userContributions: userContributionsReducer,
  userFavorites: userFavoritesReducer,
  users: allUsersReducer,
  userStructure: structureReducer,
  widgets: widgetsReducer
});

export const appReducer: Reducer<any, any> = (state, action) => {
  if (action.type === HYDRATE) {
    // action sent by Next with the server side data
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
    if (action.payload.user) {
      nextState.user = action.payload.user;
    }
    if (action.payload.selectedStructure) {
      nextState.selectedStructure = action.payload.selectedStructure;
    }
    if (action.payload.langue.langues.length > 0 && nextState.langue.langues.length === 0) {
      nextState.langue = action.payload.langue;
    }
    if (action.payload.themes.activeThemes.length > 0) {
      // keep new themes even if already in store
      nextState.themes = action.payload.themes;
    }
    if (action.payload.needs.length > 0 && nextState.needs.length === 0) {
      nextState.needs = action.payload.needs;
    }
    if (action.payload.searchResults) {
      nextState.searchResults = action.payload.searchResults;
    }
    return nextState;
  }
  return combinedReducer(state, action);
};
