import type { Connection } from "mongoose";
import mongoose from "mongoose";
import { ThemeSeedIds } from "~/__fixtures__/seed-data/themes";

export interface NeedSeedIds {
  NA1: mongoose.Types.ObjectId;
  NA2: mongoose.Types.ObjectId;
  NB1: mongoose.Types.ObjectId;
}

export const getNeedSeedIds = (): NeedSeedIds => ({
  NA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  NA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  NB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

export interface NeedDocument {
  _id: mongoose.Types.ObjectId;
  theme: mongoose.Types.ObjectId;
}

export const makeNeedsList = (needIds: NeedSeedIds, themeIds: ThemeSeedIds): NeedDocument[] => [
  { _id: needIds.NA1, theme: themeIds.TA },
  { _id: needIds.NA2, theme: themeIds.TA },
  { _id: needIds.NB1, theme: themeIds.TB },
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
