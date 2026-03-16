import { type Theme, type ThemeId, ThemeModel, type ThemeType } from "@refugies-info/mongo";
import type { DeleteResult } from "~/types/interface";

export const getTheme = (id: ThemeId) => ThemeModel.findOne({ _id: id });

export const getAllThemes = () => ThemeModel.find().cacheQuery();

export const createTheme = (theme: ThemeType) => ThemeModel.create(theme);

export const updateTheme = async (themeId: ThemeId, theme: Partial<Theme>) => {
  return ThemeModel.findOneAndUpdate({ _id: themeId }, theme, { upsert: true, new: true });
};

export const deleteThemeById = async (themeId: ThemeId): Promise<DeleteResult> =>
  ThemeModel.deleteOne({ _id: themeId });
