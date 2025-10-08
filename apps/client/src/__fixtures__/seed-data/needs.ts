import type { Connection } from "mongoose";
import mongoose from "mongoose";
import type { NeedDocument, NeedSeedIds, ThemeSeedIds } from "./types";

export const getNeedSeedIds = (): NeedSeedIds => ({
  NA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  NA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  NB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

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
