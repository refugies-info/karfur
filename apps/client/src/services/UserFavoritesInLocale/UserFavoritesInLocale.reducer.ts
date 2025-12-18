import type { GetUserFavoritesResponse } from "@refugies-info/api-types";
import { createReducer } from "typesafe-actions";
import type { UserFavoritesActions } from "./UserFavoritesInLocale.actions";

export type UserFavoritesState = {
  favorites: GetUserFavoritesResponse[] | null;
};

const initialUserFavoritesState: UserFavoritesState = {
  favorites: null,
};

export const userFavoritesReducer = createReducer<UserFavoritesState, UserFavoritesActions>(
  initialUserFavoritesState,
  {
    SET_USER_FAVORITES: (state, action) => ({ ...state, favorites: action.payload }),
  },
);
