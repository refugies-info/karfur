import { type Snapshot, SnapshotModel } from "@refugies-info/mongo";

export const createSnapshot = async (snapshot: Snapshot) => {
  return new SnapshotModel(snapshot).save();
};
