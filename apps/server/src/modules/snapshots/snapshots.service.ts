import { createSnapshot } from "~/modules/snapshots/snapshots.repository";
import { Dispositif, ObjectId, Snapshot, SnapshotType } from "~/typegoose";

export const takeSnapshot = async (dispositif: Dispositif, type: SnapshotType, from: string, to: string) => {
  const snapshot = new Snapshot();
  snapshot.dispositifId = new ObjectId(dispositif._id.toString());
  snapshot.version = 1;
  snapshot.snapshotType = type;
  snapshot.transitionFrom = from;
  snapshot.transitionTo = to;
  snapshot.dispositifData = dispositif.translations["fr"].content;
  return createSnapshot(snapshot);
};
