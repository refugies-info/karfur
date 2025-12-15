import type { GetUserFavoritesResponse } from "@refugies-info/api-types";
import type { RootState } from "../rootReducer";

export const userFavoritesSelector = (state: RootState): GetUserFavoritesResponse[] | null =>
  state.userFavorites.favorites;
