import { Action, combineReducers } from "redux";
import { ContentsState, contentsReducer, initialContentsState } from "./Contents/contents.reducer";
import {
  GroupedContentsState,
  groupedContentsReducer,
  initialGroupedContentsState,
} from "./ContentsGroupedByNeeds/contentsGroupedByNeeds.reducer";
import { LanguageState, initialLanguageState, languagesReducer } from "./Languages/languages.reducer";
import { LoadingStatusState, initialLoadingState, loadingStatusReducer } from "./LoadingStatus/loadingStatus.reducer";
import { NeedState, initialNeedState, needsReducer } from "./Needs/needs.reducer";
import {
  SelectedContentState,
  initialSelectedContentState,
  selectedContentReducer,
} from "./SelectedContent/selectedContent.reducer";
import { ThemeState, initialThemeState, themesReducer } from "./Themes/themes.reducer";
import { UserState, initialUserState, userReducer } from "./User/user.reducer";
import { VoiceOverState, initialVoiceOverState, voiceOverReducer } from "./VoiceOver/voiceOver.reducer";
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

export const rootReducer = (state: RootState | undefined, action: Action<any>): RootReducer =>
  // @ts-ignore
  appReducer(state, action);
