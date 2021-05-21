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

const appReducer = combineReducers({
  loadingStatus: loadingStatusReducer,
  languages: languagesReducer,
});

export interface RootState {
  loadingStatus: LoadingStatusState;
  languages: LanguageState;
}

type RootReducer = ReturnType<typeof appReducer>;

export const initialRootStateFactory = (): RootState => ({
  loadingStatus: initialLoadingState,
  languages: initialLanguageState,
});

export const rootReducer = (
  state: RootState | undefined,
  action: Action<any>
): RootReducer =>
  // @ts-ignore
  appReducer(state, action);
