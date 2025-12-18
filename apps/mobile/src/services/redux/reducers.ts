import { combineReducers } from "redux";
import {
  type ContentsState,
  contentsReducer,
  initialContentsState,
} from "./Contents/contents.reducer";
import {
  type GroupedContentsState,
  groupedContentsReducer,
  initialGroupedContentsState,
} from "./ContentsGroupedByNeeds/contentsGroupedByNeeds.reducer";
import {
  initialLanguageState,
  type LanguageState,
  languagesReducer,
} from "./Languages/languages.reducer";
import {
  initialLoadingState,
  type LoadingStatusState,
  loadingStatusReducer,
} from "./LoadingStatus/loadingStatus.reducer";
import { initialNeedState, type NeedState, needsReducer } from "./Needs/needs.reducer";
import {
  initialSelectedContentState,
  type SelectedContentState,
  selectedContentReducer,
} from "./SelectedContent/selectedContent.reducer";
import { initialThemeState, type ThemeState, themesReducer } from "./Themes/themes.reducer";
import { initialUserState, type UserState, userReducer } from "./User/user.reducer";
import {
  initialVoiceOverState,
  type VoiceOverState,
  voiceOverReducer,
} from "./VoiceOver/voiceOver.reducer";

const appReducer = combineReducers({
  loadingStatus: loadingStatusReducer,
  languages: languagesReducer,
  user: userReducer,
  contents: contentsReducer,
  selectedContent: selectedContentReducer,
  needs: needsReducer,
  groupedContents: groupedContentsReducer,
  voiceOver: voiceOverReducer,
  themes: themesReducer,
});

export type AppActions = Parameters<typeof appReducer>[1];

export interface RootState {
  loadingStatus: LoadingStatusState;
  languages: LanguageState;
  user: UserState;
  contents: ContentsState;
  selectedContent: SelectedContentState;
  needs: NeedState;
  groupedContents: GroupedContentsState;
  voiceOver: VoiceOverState;
  themes: ThemeState;
}

type RootReducer = ReturnType<typeof appReducer>;

export const initialRootStateFactory = (): RootState => ({
  loadingStatus: initialLoadingState,
  languages: initialLanguageState,
  user: initialUserState,
  contents: initialContentsState,
  selectedContent: initialSelectedContentState,
  needs: initialNeedState,
  groupedContents: initialGroupedContentsState,
  voiceOver: initialVoiceOverState,
  themes: initialThemeState,
});

export const rootReducer = (state: RootState | undefined, action: AppActions): RootReducer =>
  appReducer(state, action);
