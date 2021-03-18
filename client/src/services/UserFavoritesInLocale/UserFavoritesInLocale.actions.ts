import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { IUserFavorite } from "../../types/interface";

export const fetchUserFavoritesActionCreator = (value: { locale: string }) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: IUserFavorite[]) =>
  action(SET_USER_FAVORITES, value);

const actions = {
  fetchUserFavoritesActionCreator,
  setUserFavoritesActionCreator,
};

export type UserFavoritesActions = ActionType<typeof actions>;
