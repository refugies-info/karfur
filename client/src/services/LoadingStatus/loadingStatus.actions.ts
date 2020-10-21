import { action, ActionType } from "typesafe-actions";

export enum LoadingStatusKey {
  FETCH_SELECTED_DISPOSITIF = "FETCH_SELECTED_DISPOSITIF",
  FETCH_USER_STRUCTURE = "FETCH_USER_STRUCTURE",
  FETCH_USER = "FETCH_USER",
}

export const startLoading = (key: LoadingStatusKey) =>
  action("LOADING_START", { key });
export const finishLoading = (key: LoadingStatusKey) =>
  action("LOADING_END", { key });
export const setError = (key: LoadingStatusKey, error: string) =>
  action("LOADING_ERROR", { key, error });

const actions = {
  startLoading,
  finishLoading,
  setError,
};

export type LoadingStatusActions = ActionType<typeof actions>;
