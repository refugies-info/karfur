import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db, ObjectId } from "mongodb";

/**
 * Migration: Remove invalid suggestions from dispositifs_draft collection
 *
 * RI-1192: The previous migration (Migration1743662400000) only cleaned the
 * `dispositifs` collection. This left old drafts with invalid suggestions
 * (empty suggestion field) that still cause validation errors on autosave.
 *
 * This migration is a companion to the previous one, cleaning up the
 * dispositifs_draft collection.
 */
export class Migration1777000000000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const collectionsToClean = ["dispositifs_draft", "dispositifs"];

    let totalRemoved = 0;
    let totalDocs = 0;

    for (const collectionName of collectionsToClean) {
      const collection = db.collection(collectionName);

      // Find documents with invalid suggestions using $elemMatch
      // Invalid means: suggestion is null, empty string, or whitespace-only
      const query = {
        suggestions: {
          $elemMatch: {
            $or: [{ suggestion: null }, { suggestion: "" }, { suggestion: { $regex: /^\s+$/ } }],
          },
        },
      };

      // Use cursor for memory efficiency
      const cursor = collection.find(query, {
        projection: { _id: 1, suggestions: 1 },
      });

      const bulkOps: {
        updateOne: { filter: { _id: ObjectId }; update: { $set: { suggestions: unknown[] } } };
      }[] = [];

      for await (const doc of cursor) {
        const validSuggestions = (doc.suggestions || []).filter(
          (s: { suggestion?: string }) => s.suggestion && s.suggestion.trim() !== "",
        );
        const removedCount = (doc.suggestions?.length || 0) - validSuggestions.length;

        if (removedCount > 0) {
          bulkOps.push({
            updateOne: {
              filter: { _id: doc._id as ObjectId },
              update: { $set: { suggestions: validSuggestions } },
            },
          });
          totalRemoved += removedCount;
          totalDocs++;
        }
      }

      if (bulkOps.length > 0) {
        const result = await collection.bulkWrite(bulkOps);
        console.log(
          `[Migration1777000000000] Cleaned ${collectionName}: removed ${totalRemoved} invalid suggestion(s) from ${result.modifiedCount} document(s)`,
        );
      } else {
        console.log(`[Migration1777000000000] No invalid suggestions found in ${collectionName}`);
      }
    }

    console.log(
      `[Migration1777000000000] Total: removed ${totalRemoved} invalid suggestion(s) from ${totalDocs} document(s)`,
    );
  }

  public async down(): Promise<void> {
    // No-op rollback: we cannot recover the removed invalid suggestions
    console.log("[Migration1777000000000] down() is a no-op.");
  }
}
