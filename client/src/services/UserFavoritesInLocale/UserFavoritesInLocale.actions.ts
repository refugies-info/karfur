import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
  TOGGLE_USER_FAVORITES_MODAL,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { SearchDispositif } from "../../types/interface";
import { ObjectId } from "mongodb";

export const fetchUserFavoritesActionCreator = (value: string) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: SearchDispositif[]) =>
  action(SET_USER_FAVORITES, value);

export const updateUserFavoritesActionCreator = (value: {
  dispositifId?: ObjectId;
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
