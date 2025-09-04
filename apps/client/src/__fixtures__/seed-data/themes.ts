import mongoose from "mongoose";

export interface ThemesSeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  themeC: mongoose.Types.ObjectId;
}

export const makeThemesSeedIds = (): ThemesSeedIds => ({
  themeA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  themeB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  themeC: new mongoose.Types.ObjectId("64a0000000000000000000c3"),
});

export const makeThemesList = (ids: ThemesSeedIds) => [
  { _id: ids.themeA, name: "Theme A" },
  { _id: ids.themeB, name: "Theme B" },
  { _id: ids.themeC, name: "Theme C" },
];
