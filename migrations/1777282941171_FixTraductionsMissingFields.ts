import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Set default [] for missing toReviewCache/toReview in traductions
 *
 * Context:
 * The traductions collection has 43 documents without `toReviewCache` and
 * 15 without `toReview`. These are typically "À traduire" entries — first-ever
 * translations that were never validated, so addToReview() was never called.
 *
 * Impact:
 * - `toReviewCache` undefined → crashes Airtable export sync (RI-1189):
 *     TypeError: Cannot read properties of undefined (reading 'length')
 *     in traductions.service.ts line 38
 * - Code guard `(translation.toReviewCache || [])` is in place in the service,
 *   but the data fix is still needed to prevent future issues if the guard
 *   is accidentally removed.
 *
 * Fix: Set both fields to [] where missing.
 *
 * Affected: 43 docs (toReviewCache), 15 docs (toReview)
 *
 * Also fix structure with status "actif" → "Actif" (1 doc, capitalization mismatch)
 */
export class Migration1777282941171 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const tradColl = db.collection("traductions");

    // Set missing toReviewCache to []
    const toReviewCacheResult = await tradColl.updateMany(
      { toReviewCache: { $exists: false } },
      { $set: { toReviewCache: [] } },
    );
    console.log(
      `[Migration1777282941171] traductions.toReviewCache: set [] on ${toReviewCacheResult.modifiedCount} doc(s)`,
    );

    // Set missing toReview to []
    const toReviewResult = await tradColl.updateMany(
      { toReview: { $exists: false } },
      { $set: { toReview: [] } },
    );
    console.log(
      `[Migration1777282941171] traductions.toReview: set [] on ${toReviewResult.modifiedCount} doc(s)`,
    );

    // Fix structure status capitalization: "actif" → "Actif"
    const structureResult = await db
      .collection("structures")
      .updateMany({ status: "actif" }, { $set: { status: "Actif" } });
    console.log(
      `[Migration1777282941171] structures.status "actif"→"Actif": fixed ${structureResult.modifiedCount} doc(s)`,
    );

    console.log("[Migration1777282941171] Done.");
  }

  public async down(db: Db): Promise<void> {
    // Restore "Actif" → "actif" for the 1 known structure
    await db
      .collection("structures")
      .updateOne(
        { _id: { $oid: "64464b9fbe854a25012a86b6" } as any },
        { $set: { status: "actif" } },
      );
    // Cannot restore missing toReviewCache/toReview fields
    console.log(
      "[Migration1777282941171] down(): restored structure status, traductions fields unrestorable.",
    );
  }
}
