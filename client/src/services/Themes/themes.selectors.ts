import { RootState } from "../rootReducer";
import { Theme } from "../../types/interface";
import { ObjectId } from "mongodb";

export const themesSelector = (state: RootState): Theme[] => state.themes.activeThemes;

export const allThemesSelector = (state: RootState): Theme[] => [...state.themes.activeThemes, ...state.themes.inactiveThemes];

export const themeSelector = (themeId: ObjectId | null) => (state: RootState) => {
  if (!themeId) return null;
  const filteredState = state.themes.activeThemes.filter((theme) => theme._id === themeId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
