import { Action, combineReducers } from "redux";
import {
  loadingStatusReducer,
  LoadingStatusState,
  initialLoadingStateFactory,
} from "./LoadingStatus/loadingStatus.reducer";

const appReducer = combineReducers({
  loadingStatus: loadingStatusReducer,
  //   languages : languagesReducer
});

export interface RootState {
  loadingStatus: LoadingStatusState;
}

type RootReducer = ReturnType<typeof appReducer>;

export const initialRootStateFactory = (): RootState => ({
  loadingStatus: initialLoadingStateFactory(),
});

export const rootReducer = (
  state: RootState | undefined,
  action: Action<any>
): RootReducer =>
  // @ts-ignore
  appReducer(state, action);
