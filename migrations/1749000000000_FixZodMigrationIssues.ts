import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Fix sessions format for Zod schema compatibility
 *
 * Converts metadatas.sessions from array format to SessionsMetadata object:
 *   sessions: [] → sessions: { items: [] }
 *   sessions: [a, b] → sessions: { items: [a, b] }
 *
 * This fixes the 422 error on autosave when editing drafts.
 * The previous migration (MigrateSessionsToObject) only covered dispositifs,
 * this one also covers dispositifs_draft.
 */
export class FixZodMigrationIssues1749000000000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    console.log("[FixSessionsFormat] Starting migration...");

    // Fix sessions in dispositifs_draft and dispositifs
    // Use aggregation pipeline to preserve existing array elements
    const collectionsToMigrate = ["dispositifs_draft", "dispositifs"];
    for (const collectionName of collectionsToMigrate) {
      const result = await db
        .collection(collectionName)
        .updateMany({ "metadatas.sessions": { $type: "array" } }, [
          { $set: { "metadatas.sessions": { items: "$metadatas.sessions" } } },
        ]);
      console.log(`[FixSessionsFormat] Fixed ${result.modifiedCount} ${collectionName}`);
    }

    console.log("[FixSessionsFormat] Migration completed!");
  }

  public async down(db: Db): Promise<void | never> {
    console.log("[FixSessionsFormat] Rolling back...");

    // Rollback: convert sessions object back to array format
    // Use aggregation pipeline to be symmetric with up migration
    const collectionsToRollback = ["dispositifs", "dispositifs_draft"];
    for (const collectionName of collectionsToRollback) {
      const result = await db
        .collection(collectionName)
        .updateMany({ "metadatas.sessions.items": { $exists: true, $type: "array" } }, [
          { $set: { "metadatas.sessions": "$metadatas.sessions.items" } },
        ]);
      console.log(`[FixSessionsFormat] Rolled back ${result.modifiedCount} ${collectionName}`);
    }

    console.log("[FixSessionsFormat] Rollback completed!");
  }
}
