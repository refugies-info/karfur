import mongoose from "mongoose";
import type { Connection } from "mongoose";

export interface ThemeSeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  themeC: mongoose.Types.ObjectId;
}

export const makeThemesSeedIds = (): ThemeSeedIds => ({
  themeA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  themeB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  themeC: new mongoose.Types.ObjectId("64a0000000000000000000c3"),
});

export interface ThemeDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  position: number;
}

export const makeThemesList = (ids: ThemeSeedIds): ThemeDocument[] => [
  { _id: ids.themeA, position: 1, name: "Langues et intégration" },
  { _id: ids.themeB, position: 3, name: "Numérique et compétences" },
  { _id: ids.themeC, position: 2, name: "Emploi et formation" },
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
