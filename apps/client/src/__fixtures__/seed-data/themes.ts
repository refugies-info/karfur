import type { Connection } from "mongoose";
import mongoose from "mongoose";

export interface ThemeSeedIds {
  TA: mongoose.Types.ObjectId;
  TB: mongoose.Types.ObjectId;
  TC: mongoose.Types.ObjectId;
}

export const getThemeSeedIds = (): ThemeSeedIds => ({
  TA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  TB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  TC: new mongoose.Types.ObjectId("64a0000000000000000000c3"),
});

export interface ThemeDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  short: string;
  position: number;
}

export const makeThemesList = (themeIds: ThemeSeedIds): ThemeDocument[] => [
  { _id: themeIds.TA, name: "Theme A", short: "TA", position: 1 },
  { _id: themeIds.TB, name: "Theme B", short: "TB", position: 2 },
  { _id: themeIds.TC, name: "Theme C", short: "TC", position: 3 },
];

export const seedThemes = async (conn: Connection, themeIds: ThemeSeedIds) => {
  try {
    const ThemeModel = conn.model("Theme");
    const themes = makeThemesList(themeIds);
    await ThemeModel.insertMany(themes);
  } catch (error) {
    // Theme model doesn't exist in legacy tests, skip gracefully
    // This is expected behavior for legacy tests
  }
};
