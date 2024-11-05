import { GetUserFavoritesResponse } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const userFavoritesSelector = (state: RootState): GetUserFavoritesResponse[] => state.userFavorites.favorites;
