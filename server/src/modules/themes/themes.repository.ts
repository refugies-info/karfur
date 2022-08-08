import { ObjectId } from "mongoose";
import { Theme, ThemeDoc } from "../../schema/schemaTheme";

export const getAllThemes = async () => {
  return Theme.find()
    .sort({ created_at: 1 });
}

export const createTheme = async (theme: ThemeDoc) => {
  return new Theme(theme).save()
}

export const updateTheme = async (themeId: ObjectId, theme: Partial<ThemeDoc>) => {
  return Theme.findOneAndUpdate({ _id: themeId }, theme, { upsert: true, new: true })
}

export const deleteThemeById = async (themeId: ObjectId) => {
  return Theme.deleteOne({ _id: themeId });
}
