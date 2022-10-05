import {
  FETCH_USER_FAVORITES,
  SET_USER_FAVORITES,
  UPDATE_USER_FAVORITES,
} from "./UserFavoritesInLocale.actionTypes";
import { ActionType, action } from "typesafe-actions";
import { IDispositif } from "../../types/interface";
import { ObjectId } from "mongodb";

export const fetchUserFavoritesActionCreator = (value: string) =>
  action(FETCH_USER_FAVORITES, value);

export const setUserFavoritesActionCreator = (value: IDispositif[]) =>
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
