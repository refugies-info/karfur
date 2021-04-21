import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { IUserFavorite } from "../../types/interface";
import { ObjectId } from "mongodb";

export const fetchUserFavoritesActionCreator = (value: string) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: IUserFavorite[]) =>
  action(SET_USER_FAVORITES, value);

export const updateUserFavoritesActionCreator = (value: {
  dispositifId?: ObjectId;
  type: "remove" | "remove-all";
  locale: string;
}) => action(UPDATE_USER_FAVORITES, value);

const actions = {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
  updateUserFavoritesActionCreator,
};

export type UserFavoritesActions = ActionType<typeof actions>;
