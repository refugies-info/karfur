import { createReducer } from "typesafe-actions";
import { LoadingStatusActions } from "./loadingStatus.actions";

export interface LoadingStatusState {
  [key: string]: {
    error: string | undefined;
    isLoading: boolean;
  };
}

export const initialLoadingState = {};

export const loadingStatusReducer = createReducer<
  LoadingStatusState,
  LoadingStatusActions
>(initialLoadingState, {
  LOADING_START: (state, action) => ({
    ...state,
    [action.payload.key]: {
      ...state[action.payload.key],
      isLoading: true,
      error: undefined,
    },
  }),
  LOADING_END: (state, action) => ({
    ...state,
    [action.payload.key]: {
      ...state[action.payload.key],
      isLoading: false,
      error: undefined,
    },
  }),
  LOADING_ERROR: (state, action) => ({
    ...state,
    [action.payload.key]: {
      ...state[action.payload.key],
      isLoading: false,
      error: action.payload.error,
    },
  }),
});
