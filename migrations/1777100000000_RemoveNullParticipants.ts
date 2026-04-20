import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Remove null entries from participants arrays
 *
 * Legacy dispositifs (pre-Zod migration, March 2026) may have null values
 * in the participants array. This was tolerated by the old Typegoose/Mongoose
 * schema but causes CastError with the new strict Zod schema:
 *   participants: z.array(zId("User")).default([])
 *
 * The null entries cause cloneDispositifInDrafts to fail on
 * DispositifDraftModel.create(), breaking autosave for active dispositifs
 * that don't yet have a draft version.
 *
 * Root cause: old code likely added null via $addToSet with undefined userId,
 * or a legacy migration nullified deleted user refs instead of removing them.
 */
export class Migration1777100000000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const collectionsToClean = ["dispositifs", "dispositifs_draft"];

    let totalCleaned = 0;

    for (const collectionName of collectionsToClean) {
      const collection = db.collection(collectionName);

      // First, normalize documents where the field itself is null.
      // This does NOT touch missing fields.
      const nullFieldResult = await collection.updateMany(
        { participants: null },
        { $set: { participants: [] } },
      );

      // Then remove null elements inside participants arrays.
      const nullEntriesResult = await collection.updateMany(
        { participants: { $elemMatch: { $eq: null } } },
        { $pull: { participants: null } },
      );

      const collectionCleaned = nullFieldResult.modifiedCount + nullEntriesResult.modifiedCount;

      console.log(
        `[Migration1777100000000] ${collectionName}: normalized ${nullFieldResult.modifiedCount} null field(s), cleaned ${nullEntriesResult.modifiedCount} null array entries`,
      );
      totalCleaned += collectionCleaned;
    }

    console.log(`[Migration1777100000000] Total: cleaned ${totalCleaned} document(s)`);
  }

  public async down(): Promise<void> {
    // No-op: cannot recover which documents had null participants
    console.log("[Migration1777100000000] down() is a no-op.");
  }
}
