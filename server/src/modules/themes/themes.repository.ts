import { Theme, ThemeId, ThemeModel } from "src/typegoose";

export const getTheme = (id: ThemeId) => ThemeModel.findOne({ _id: id });

export const getAllThemes = () => ThemeModel.find();

export const createTheme = (theme: Omit<Theme, "isActive">) => ThemeModel.create(theme);

export const updateTheme = async (themeId: ThemeId, theme: Partial<Theme>) => {
  return ThemeModel.findOneAndUpdate({ _id: themeId }, theme, { upsert: true, new: true });
};

export const deleteThemeById = async (themeId: ThemeId) => ThemeModel.deleteOne({ _id: themeId });
