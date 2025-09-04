import mongoose from "mongoose";

export interface SeedIds {
  themeA: mongoose.Types.ObjectId;
  themeB: mongoose.Types.ObjectId;
  themeC: mongoose.Types.ObjectId;
  needA1: mongoose.Types.ObjectId;
  needA2: mongoose.Types.ObjectId;
  needB1: mongoose.Types.ObjectId;
}

export const makeSeedIds = (): SeedIds => ({
  themeA: new mongoose.Types.ObjectId("64a0000000000000000000a1"),
  themeB: new mongoose.Types.ObjectId("64a0000000000000000000b2"),
  themeC: new mongoose.Types.ObjectId("64a0000000000000000000c3"),
  needA1: new mongoose.Types.ObjectId("64b0000000000000000000a1"),
  needA2: new mongoose.Types.ObjectId("64b0000000000000000000a2"),
  needB1: new mongoose.Types.ObjectId("64b0000000000000000000b1"),
});

export const makeNeedsList = (ids: SeedIds) => [
  { _id: ids.needA1, theme: { _id: ids.themeA } },
  { _id: ids.needA2, theme: { _id: ids.themeA } },
  { _id: ids.needB1, theme: { _id: ids.themeB } },
];
