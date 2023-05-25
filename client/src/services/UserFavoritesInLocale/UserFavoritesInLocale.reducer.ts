import { createReducer } from "typesafe-actions";
import { UserFavoritesActions } from "./UserFavoritesInLocale.actions";
import { GetUserFavoritesResponse } from "@refugies-info/api-types";

export type UserFavoritesState = {
  favorites: GetUserFavoritesResponse[],
};

const initialUserFavoritesState: UserFavoritesState = {
  favorites: [],
};

export const userFavoritesReducer = createReducer<
  UserFavoritesState,
  UserFavoritesActions
>(initialUserFavoritesState, {
  SET_USER_FAVORITES: (state, action) => ({ ...state, favorites: action.payload }),
});
