import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import { Reducer } from "typesafe-actions";
import { ActiveDispositifsState, activeDispositifsReducer } from "./ActiveDispositifs/activeDispositifs.reducer";
import { ActiveStructuresState, activeStructuresReducer } from "./ActiveStructures/activeStructures.reducer";
import { ActiveUsersState, activeUsersReducer } from "./ActiveUsers/activeUsers.reducer";
import { AllDispositifsState, allDispositifsReducer } from "./AllDispositifs/allDispositifs.reducer";
import { AllStructuresState, allStructuresReducer } from "./AllStructures/allStructures.reducer";
import { AllUsersState, allUsersReducer } from "./AllUsers/allUsers.reducer";
import {
  DispositifsWithTranslationsStatusState,
  dispositifsWithTranslationsStatusReducer,
} from "./DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.reducer";
import { LangueState, langueReducer } from "./Langue/langue.reducer";
import { LoadingStatusState, loadingStatusReducer } from "./LoadingStatus/loadingStatus.reducer";
import { MiscellaneousState, miscellaneousReducer } from "./Miscellaneous/miscellaneous.reducer";
import { NeedsState, needsReducer } from "./Needs/needs.reducer";
import { SearchResultsState, searchResultsReducer } from "./SearchResults/searchResults.reducer";
import { SelectedDispositifState, selectedDispositifReducer } from "./SelectedDispositif/selectedDispositif.reducer";
import { SelectedStructureState, selectedStructureReducer } from "./SelectedStructure/selectedStructure.reducer";
import { ThemesState, themesReducer } from "./Themes/themes.reducer";
import { TtsState, ttsReducer } from "./Tts/tts.reducer";
import { UserState, userReducer } from "./User/user.reducer";
import { UserContributionsState, userContributionsReducer } from "./UserContributions/userContributions.reducer";
import { UserFavoritesState, userFavoritesReducer } from "./UserFavoritesInLocale/UserFavoritesInLocale.reducer";
import { UserStructureState, structureReducer } from "./UserStructure/userStructure.reducer";
import { WidgetsState, widgetsReducer } from "./Widgets/widgets.reducer";

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
  tts: ttsReducer,
  user: userReducer,
  userContributions: userContributionsReducer,
  userFavorites: userFavoritesReducer,
  users: allUsersReducer,
  userStructure: structureReducer,
  widgets: widgetsReducer,
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
