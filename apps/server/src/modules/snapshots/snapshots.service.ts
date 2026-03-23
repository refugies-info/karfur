import type { DispositifStatus } from "@refugies-info/api-types";
import {
  type Dispositif,
  ObjectId,
  type Snapshot,
  SnapshotModel,
  type SnapshotType,
} from "@refugies-info/mongo";
import logger from "~/logger";
import { createSnapshot } from "~/modules/snapshots/snapshots.repository";

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
  const snapshot: Partial<Snapshot> = {
    dispositifId: new ObjectId(dispositif._id.toString()),
    version: newVersion,
    type: type,
    from: from,
    to: to,
    data: content as any,
  };

  return createSnapshot(snapshot as Snapshot);
};
