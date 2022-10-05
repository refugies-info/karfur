import { createReducer } from "typesafe-actions";
import { UserFavoritesActions } from "./UserFavoritesInLocale.actions";
import { IDispositif } from "../../types/interface";

export type UserFavoritesState = IDispositif[];

const initialUserFavoritesState: UserFavoritesState = [];

export const userFavoritesReducer = createReducer<
  UserFavoritesState,
  UserFavoritesActions
>(initialUserFavoritesState, {
  SET_USER_FAVORITES: (_, action) => action.payload,
});
