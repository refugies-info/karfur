import { RootState } from "../rootReducer";
import { GetUserFavoritesResponse } from "api-types";

export const userFavoritesSelector = (state: RootState): GetUserFavoritesResponse[] =>
  state.userFavorites.favorites;
