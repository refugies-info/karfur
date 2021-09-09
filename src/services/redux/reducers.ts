import { Action, combineReducers } from "redux";
import {
  loadingStatusReducer,
  LoadingStatusState,
  initialLoadingState,
} from "./LoadingStatus/loadingStatus.reducer";
import {
  languagesReducer,
  LanguageState,
  initialLanguageState,
} from "./Languages/languages.reducer";
import { userReducer, UserState, initialUserState } from "./User/user.reducer";
import {
  contentsReducer,
  ContentsState,
  initialContentsState,
} from "./Contents/contents.reducer";
import {
  SelectedContentState,
  initialSelectedContentState,
  selectedContentReducer,
} from "./SelectedContent/selectedContent.reducer";
import {
  NeedState,
  initialNeedState,
  needsReducer,
} from "./Needs/needs.reducer";

const appReducer = combineReducers({
  loadingStatus: loadingStatusReducer,
  languages: languagesReducer,
  user: userReducer,
  contents: contentsReducer,
  selectedContent: selectedContentReducer,
  needs: needsReducer,
});

export interface RootState {
  loadingStatus: LoadingStatusState;
  languages: LanguageState;
  user: UserState;
  contents: ContentsState;
  selectedContent: SelectedContentState;
  needs: NeedState;
}

type RootReducer = ReturnType<typeof appReducer>;

export const initialRootStateFactory = (): RootState => ({
  loadingStatus: initialLoadingState,
  languages: initialLanguageState,
  user: initialUserState,
  contents: initialContentsState,
  selectedContent: initialSelectedContentState,
  needs: initialNeedState,
});

export const rootReducer = (
  state: RootState | undefined,
  action: Action<any>
): RootReducer =>
  // @ts-ignore
  appReducer(state, action);
