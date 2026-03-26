import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Fix sessions format for Zod schema compatibility
 *
 * Converts metadatas.sessions from array format to SessionsMetadata object:
 *   sessions: [] → sessions: { items: [] }
 *
 * This fixes the 422 error on autosave when editing drafts.
 * The previous migration (MigrateSessionsToObject) only covered dispositifs,
 * this one also covers dispositifs_draft.
 */
export class FixZodMigrationIssues1749000000000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    console.log("[FixSessionsFormat] Starting migration...");

    // Fix sessions in dispositifs_draft
    const draftsResult = await db
      .collection("dispositifs_draft")
      .updateMany(
        { "metadatas.sessions": { $type: "array" } },
        { $set: { "metadatas.sessions": { items: [] } } },
      );
    console.log(`[FixSessionsFormat] Fixed ${draftsResult.modifiedCount} dispositifs_draft`);

    // Fix sessions in dispositifs (in case previous migration missed some)
    const dispositifsResult = await db
      .collection("dispositifs")
      .updateMany(
        { "metadatas.sessions": { $type: "array" } },
        { $set: { "metadatas.sessions": { items: [] } } },
      );
    console.log(`[FixSessionsFormat] Fixed ${dispositifsResult.modifiedCount} dispositifs`);

    console.log("[FixSessionsFormat] Migration completed!");
  }

  public async down(db: Db): Promise<void | never> {
    console.log("[FixSessionsFormat] Rolling back...");

    await db
      .collection("dispositifs")
      .updateMany(
        { "metadatas.sessions.items": { $exists: true, $size: 0 } },
        { $set: { "metadatas.sessions": [] } },
      );

    await db
      .collection("dispositifs_draft")
      .updateMany(
        { "metadatas.sessions.items": { $exists: true, $size: 0 } },
        { $set: { "metadatas.sessions": [] } },
      );

    console.log("[FixSessionsFormat] Rollback completed!");
  }
}
