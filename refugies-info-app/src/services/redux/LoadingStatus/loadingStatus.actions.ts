import { action, ActionType } from "typesafe-actions";

export enum LoadingStatusKey {
  FETCH_LANGUAGES = "FETCH_LANGUAGES",
  FETCH_CONTENTS = "FETCH_CONTENTS",
  FETCH_SELECTED_CONTENT = "FETCH_SELECTED_CONTENT",
}

export const startLoading = (key: LoadingStatusKey) =>
  action("LOADING_START", { key });
export const finishLoading = (key: LoadingStatusKey) =>
  action("LOADING_END", { key });
export const setError = (key: LoadingStatusKey, error: string | undefined) =>
  action("LOADING_ERROR", { key, error });

const actions = {
  startLoading,
  finishLoading,
  setError,
};

export type LoadingStatusActions = ActionType<typeof actions>;
