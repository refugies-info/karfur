import { RootState } from "../rootReducer";
import { GetUserFavoritesResponse } from "@refugies-info/api-types";

export const userFavoritesSelector = (state: RootState): GetUserFavoritesResponse[] =>
  state.userFavorites.favorites;
