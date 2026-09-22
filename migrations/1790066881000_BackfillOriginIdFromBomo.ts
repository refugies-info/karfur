import fs from "fs";
import type { MigrationInterface } from "mongo-migrate-ts";
import { type Db, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

const migrationDir = path.dirname(fileURLToPath(import.meta.url));
const mappingPath = path.join(migrationDir, "origin-id-mapping.csv");

type OriginIdMapping = { dispositifId: string; originId: string };

const parseMapping = (csv: string): OriginIdMapping[] =>
  csv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [dispositifId, originId] = line.trim().split(",");
      return { dispositifId, originId };
    })
    .filter(({ dispositifId, originId }) => ObjectId.isValid(dispositifId) && !!originId);

// CSV exported from the BOMO Supabase: publication_records.remote_id -> di_services.di_id.
// The ids come from production, so environments like staging legitimately match nothing.
const readMapping = (): OriginIdMapping[] => {
  if (!fs.existsSync(mappingPath)) {
    console.log(`No mapping file at ${mappingPath}, nothing to backfill`);
    return [];
  }
  return parseMapping(fs.readFileSync(mappingPath, "utf8"));
};

export class backfillOriginIdFromBomo1790066881000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const mapping = readMapping();
    if (mapping.length === 0) return;

    const result = await db.collection("dispositifs").bulkWrite(
      mapping.map(({ dispositifId, originId }) => ({
        updateOne: {
          filter: { _id: new ObjectId(dispositifId), originId: { $exists: false } },
          update: { $set: { originId } },
        },
      })),
      { ordered: false },
    );

    console.log(`Backfilled ${result.modifiedCount}/${mapping.length} dispositifs with originId`);
  }

  // Only unsets what this migration wrote: dispositifs published after the BOMO change receive
  // originId at publication time and must keep it.
  public async down(db: Db): Promise<void | never> {
    const ids = readMapping().map(({ dispositifId }) => new ObjectId(dispositifId));
    if (ids.length === 0) return;

    const result = await db
      .collection("dispositifs")
      .updateMany({ _id: { $in: ids } }, { $unset: { originId: "" } });

    console.log(`Removed originId from ${result.modifiedCount} dispositifs`);
  }
}
