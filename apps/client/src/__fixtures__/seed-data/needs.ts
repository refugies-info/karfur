import mongoose from "mongoose";
import type { Connection } from "mongoose";

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

export interface NeedDocument {
  _id: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
}

export const makeNeedsList = (needIds: NeedSeedIds, themeIds: ThemeSeedIds): NeedDocument[] => [
  { _id: needIds.needA1, theme: themeIds.themeA },
  { _id: needIds.needA2, theme: themeIds.themeA },
  { _id: needIds.needB1, theme: themeIds.themeB },
];

export const seedNeeds = async (conn: Connection, needIds: NeedSeedIds, themeIds: ThemeSeedIds) => {
  try {
    const NeedModel = conn.model("Need");
    const needs = makeNeedsList(needIds, themeIds);
    await NeedModel.insertMany(needs);
  } catch (error) {
    // Need model doesn't exist in legacy tests, skip gracefully
    // This is expected behavior for legacy tests
  }
};
