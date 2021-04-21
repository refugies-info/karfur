import { RootState } from "../rootReducer";
import { UserFavoritesState } from "./UserFavoritesInLocale.reducer";

export const userFavoritesSelector = (state: RootState): UserFavoritesState =>
  state.userFavorites;
