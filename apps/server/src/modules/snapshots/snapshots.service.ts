import type { DispositifStatus } from "@refugies-info/api-types";
import logger from "~/logger";
import { createSnapshot } from "~/modules/snapshots/snapshots.repository";
import { type Dispositif, ObjectId, Snapshot, SnapshotModel, type SnapshotType } from "~/typegoose";

export const takeSnapshot = async (
  dispositif: Dispositif,
  type: SnapshotType,
  from: DispositifStatus,
  to: DispositifStatus,
) => {
  const content = dispositif.translations?.fr?.content;

  if (!content) {
    logger.error("[takeSnapshot] No content found for dispositif", dispositif._id);
    return undefined;
  }

  // Find the highest version for the given dispositifId
  const latestSnapshot = await SnapshotModel.findOne({ dispositifId: dispositif._id })
    .sort({ version: -1 })
    .lean();
  const newVersion = latestSnapshot ? latestSnapshot.version + 1 : 1;

  // Create snapshot
  const snapshot = new Snapshot();
  snapshot.dispositifId = new ObjectId(dispositif._id.toString());
  snapshot.version = newVersion;
  snapshot.type = type;
  snapshot.from = from;
  snapshot.to = to;
  snapshot.data = content;

  return createSnapshot(snapshot);
};
