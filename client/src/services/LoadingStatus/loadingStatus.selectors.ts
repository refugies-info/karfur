import { RootState } from "../rootReducer";
import { LoadingStatusKey } from "./loadingStatus.actions";

const loadingStatusSelector = (state: RootState, key: LoadingStatusKey) =>
  state.loadingStatus[key];

export const isLoadingSelector = (key: LoadingStatusKey) => (
  state: RootState
): boolean => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? loadingStatus.isLoading : false;
};

export const hasErroredSelector = (key: LoadingStatusKey) => (
  state: RootState
): boolean => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? !!loadingStatus.error : false;
};

export const errorSelector = (key: LoadingStatusKey) => (
  state: RootState
): string | null | undefined => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? loadingStatus.error : null;
};
