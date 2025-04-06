import logger from "~/logger";
import { createSnapshot } from "~/modules/snapshots/snapshots.repository";
import { Dispositif, ObjectId, Snapshot, SnapshotModel, SnapshotType } from "~/typegoose";

export const takeSnapshot = async (dispositif: Dispositif, type: SnapshotType, from: string, to: string) => {
  const content = dispositif.translations?.fr?.content;

  if (!content) {
    logger.error("[takeSnapshot] No content found for dispositif", dispositif._id);
    return undefined;
  }

  // Find the highest version for the given dispositifId
  const latestSnapshot = await SnapshotModel.findOne({ dispositifId: dispositif._id }).sort({ version: -1 }).lean();
  const newVersion = latestSnapshot ? latestSnapshot.version + 1 : 1;

  // Create snapshot
  const snapshot = new Snapshot();
  snapshot.dispositifId = new ObjectId(dispositif._id.toString());
  snapshot.version = newVersion;
  snapshot.snapshotType = type;
  snapshot.transitionFrom = from;
  snapshot.transitionTo = to;
  snapshot.dispositifData = content;

  return createSnapshot(snapshot);
};
