import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
  TOGGLE_USER_FAVORITES_MODAL,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { GetUserFavoritesResponse, Id } from "api-types";

export const fetchUserFavoritesActionCreator = (value: string) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: GetUserFavoritesResponse[]) =>
  action(SET_USER_FAVORITES, value);

export const updateUserFavoritesActionCreator = (value: {
  dispositifId?: Id;
  type: "remove" | "remove-all";
  locale: string;
}) => action(UPDATE_USER_FAVORITES, value);

export const toggleUserFavoritesModalActionCreator = (show: boolean) =>
  action(TOGGLE_USER_FAVORITES_MODAL, show);

const actions = {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
  toggleUserFavoritesModalActionCreator
};

export type UserFavoritesActions = ActionType<typeof actions>;
