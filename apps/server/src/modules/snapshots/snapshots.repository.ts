import { type Snapshot, SnapshotModel } from "~/typegoose";

export const createSnapshot = async (snapshot: Snapshot) => {
  return new SnapshotModel(snapshot).save();
};
