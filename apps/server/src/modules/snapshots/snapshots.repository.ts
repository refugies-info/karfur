import { DispositifSnapshot, DispositifSnapshotModel } from "~/typegoose";

export const createSnapshot = async (snapshot: DispositifSnapshot) => {
  return new DispositifSnapshotModel(snapshot).save();
};
