import { RootState } from "../rootReducer";
import { SearchDispositif } from "types/interface";

export const userFavoritesSelector = (state: RootState): SearchDispositif[] =>
  state.userFavorites.favorites;

export const isFavoriteModalVisibleSelector = (state: RootState): boolean =>
  state.userFavorites.showFavoriteModal;
