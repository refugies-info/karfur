import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Fix remaining sessions in old array format ([] instead of SessionsMetadata)
 *
 * Despite the previous migrations (1749000000000, 1772529648826), 3 documents
 * still have `metadatas.sessions: []` (old format). This is because:
 * - The autosave code (dispositif.service.ts line 572) replaces the entire
 *   `metadatas` object with whatever the frontend sends.
 * - The frontend reads sessions: [] from the DB, and sends it back as-is
 *   during autosave, reintroducing the old format.
 *
 * Root cause of original data:
 * - These are RI-origin dispositifs (not RCO), so sessions should be null/absent.
 * - They previously had sessions data from before origin-based guards were added.
 *
 * Fix:
 * - For RI-origin dispositifs: set sessions to null (they should not have sessions)
 * - For RCO-origin dispositifs: convert [] to { items: [] } (proper empty format)
 *
 * Affected collections: dispositifs (2 docs), dispositifs_draft (1 doc)
 *
 * Prevention: See companion code fix in dispositif.service.ts that sanitizes
 * sessions: [] to null before saving.
 */
export class Migration1777282941167 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const collectionsToFix = ["dispositifs", "dispositifs_draft"];
    let totalFixed = 0;

    for (const collectionName of collectionsToFix) {
      const collection = db.collection(collectionName);

      // Fix RI-origin dispositifs: sessions should be null (not applicable for RI)
      const riResult = await collection.updateMany(
        {
          "metadatas.sessions": { $type: "array" },
          $or: [{ origin: "RI" }, { origin: { $exists: false } }],
        },
        { $set: { "metadatas.sessions": null } },
      );

      // Fix RCO-origin dispositifs: convert [] to { items: [] }
      const rcoEmptyResult = await collection.updateMany(
        {
          "metadatas.sessions": { $eq: [] },
          origin: "RCO",
        },
        { $set: { "metadatas.sessions": { items: [] } } },
      );

      // Fix RCO-origin with sessions as a non-empty array (old format)
      // In this case, wrap the existing array as { items: [...] }
      // Note: this uses an aggregation pipeline update to preserve the items
      const rcoArrayResult = await collection.updateMany(
        {
          "metadatas.sessions": { $type: "array", $not: { $eq: [] } },
          origin: "RCO",
        },
        [
          {
            $set: {
              "metadatas.sessions": {
                items: "$metadatas.sessions",
              },
            },
          },
        ],
      );

      const collectionFixed =
        riResult.modifiedCount + rcoEmptyResult.modifiedCount + rcoArrayResult.modifiedCount;
      console.log(
        `[Migration1777282941167] ${collectionName}: RI→null: ${riResult.modifiedCount}, RCO empty→{items:[]}: ${rcoEmptyResult.modifiedCount}, RCO array→{items:[...]}: ${rcoArrayResult.modifiedCount}`,
      );
      totalFixed += collectionFixed;
    }

    console.log(`[Migration1777282941167] Total: fixed ${totalFixed} document(s)`);
  }

  public async down(): Promise<void> {
    // Cannot restore original array format without knowing which docs had it.
    console.log("[Migration1777282941167] down() is a no-op.");
  }
}
