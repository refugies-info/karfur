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

const appReducer = combineReducers({
  loadingStatus: loadingStatusReducer,
  languages: languagesReducer,
  user: userReducer,
});

export interface RootState {
  loadingStatus: LoadingStatusState;
  languages: LanguageState;
  user: UserState;
}

type RootReducer = ReturnType<typeof appReducer>;

export const initialRootStateFactory = (): RootState => ({
  loadingStatus: initialLoadingState,
  languages: initialLanguageState,
  user: initialUserState,
});

export const rootReducer = (
  state: RootState | undefined,
  action: Action<any>
): RootReducer =>
  // @ts-ignore
  appReducer(state, action);
