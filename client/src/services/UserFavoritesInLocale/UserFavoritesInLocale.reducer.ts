import { createReducer } from "typesafe-actions";
import { UserFavoritesActions } from "./UserFavoritesInLocale.actions";
import { GetUserFavoritesResponse } from "api-types";

export type UserFavoritesState = {
  favorites: GetUserFavoritesResponse[],
  showFavoriteModal: boolean
};

const initialUserFavoritesState: UserFavoritesState = {
  favorites: [],
  showFavoriteModal: false
};

export const userFavoritesReducer = createReducer<
  UserFavoritesState,
  UserFavoritesActions
>(initialUserFavoritesState, {
  SET_USER_FAVORITES: (state, action) => ({ ...state, favorites: action.payload }),
  TOGGLE_USER_FAVORITES_MODAL: (state, action) => ({ ...state, showFavoriteModal: action.payload }),
});
