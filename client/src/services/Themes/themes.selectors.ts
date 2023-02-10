import { RootState } from "../rootReducer";
import { Theme } from "../../types/interface";
import { ObjectId } from "mongodb";

export const themesSelector = (state: RootState): Theme[] => state.themes.activeThemes;

export const allThemesSelector = (state: RootState): Theme[] => [...state.themes.activeThemes, ...state.themes.inactiveThemes];

export const themeSelector = (themeId: ObjectId | null) => (state: RootState) => {
  if (!themeId) return null;
  const theme = state.themes.activeThemes.find((theme) => theme._id === themeId);

  return theme || null;
};
