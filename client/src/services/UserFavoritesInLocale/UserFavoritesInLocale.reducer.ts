import { createReducer } from "typesafe-actions";
import { UserFavoritesActions } from "./UserFavoritesInLocale.actions";
import { IUserFavorite } from "../../types/interface";

export type UserFavoritesState = IUserFavorite[];

const initialUserFavoritesState: UserFavoritesState = [];

export const userFavoritesReducer = createReducer<
  UserFavoritesState,
  UserFavoritesActions
>(initialUserFavoritesState, {
  SET_USER_FAVORITES: (_, action) => action.payload,
});
