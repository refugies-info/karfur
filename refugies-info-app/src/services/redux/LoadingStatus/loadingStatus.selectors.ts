import { RootState } from "../reducers";
import { LoadingStatusKey } from "./loadingStatus.actions";

const loadingStatusSelector = (state: RootState, key: string) =>
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
): string | undefined => {
  const loadingStatus = loadingStatusSelector(state, key);
  return loadingStatus ? loadingStatus.error : undefined;
};
