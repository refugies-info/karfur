import mongoose from "mongoose";

export interface NeedSeedIds {
  needA1: mongoose.Types.ObjectId;
  needA2: mongoose.Types.ObjectId;
  needB1: mongoose.Types.ObjectId;
}

export const makeNeedsSeedIds = (): NeedSeedIds => ({
  needA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  needA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  needB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

export interface ThemeSeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  themeC: mongoose.Types.ObjectId;
}

export const makeNeedsList = (needIds: NeedSeedIds, themeIds: ThemeSeedIds) => [
  { _id: needIds.needA1, theme: { _id: themeIds.themeA } },
  { _id: needIds.needA2, theme: { _id: themeIds.themeA } },
  { _id: needIds.needB1, theme: { _id: themeIds.themeB } },
];
