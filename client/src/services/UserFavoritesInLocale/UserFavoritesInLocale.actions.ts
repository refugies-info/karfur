import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { GetUserFavoritesResponse, Id } from "@refugies-info/api-types";

export const fetchUserFavoritesActionCreator = (value: string) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: GetUserFavoritesResponse[]) =>
  action(SET_USER_FAVORITES, value);

export const updateUserFavoritesActionCreator = (value: {
  dispositifId?: Id;
  type: "remove" | "remove-all";
  locale: string;
}) => action(UPDATE_USER_FAVORITES, value);

const actions = {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
  updateUserFavoritesActionCreator
};

export type UserFavoritesActions = ActionType<typeof actions>;
