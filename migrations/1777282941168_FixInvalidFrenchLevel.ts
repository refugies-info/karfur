import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: Replace invalid frenchLevel value "A1.1" with "A1"
 *
 * Context:
 * The `frenchLevel` metadata field only accepts values from the
 * `frenchLevelType` enum in api-types:
 *   ["alpha", "A1", "A2", "B1", "B2", "C1", "C2"]
 *
 * 5 dispositifs have `metadatas.frenchLevel: ["A1.1"]` — a subdivision
 * of A1 used in some French language curricula but NOT in our enum.
 * These are old documents (IDs from 2019-2020).
 *
 * These docs cause HTTP 422 on autosave because TSOA validates the request
 * body against the strict enum type.
 *
 * Fix: Replace "A1.1" with "A1" — the closest valid value.
 *
 * Affected: 5 dispositifs
 */
export class Migration1777282941168 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Use arrayFilters to replace only the "A1.1" element(s) in the array
    const result = await db.collection("dispositifs").updateMany(
      { "metadatas.frenchLevel": "A1.1" },
      {
        $set: { "metadatas.frenchLevel.$[elem]": "A1" },
      },
      {
        arrayFilters: [{ elem: { $eq: "A1.1" } }],
      },
    );

    console.log(
      `[Migration1777282941168] Fixed ${result.modifiedCount} dispositif(s) with frenchLevel "A1.1" → "A1"`,
    );
  }

  public async down(db: Db): Promise<void> {
    // Restore "A1" to "A1.1" — note: this affects ALL "A1" values in the
    // 5 previously fixed documents, not just the ones that were A1.1.
    // This is intentionally conservative: don't try to distinguish.
    const result = await db.collection("dispositifs").updateMany(
      {
        _id: {
          $in: [
            // Original 5 doc IDs from audit
            { $oid: "5dc2ef87bceb3c004fc42c83" },
            { $oid: "5dee0828afabdf00513bae8a" },
            { $oid: "5e789d420c9490004e55e2e6" },
            { $oid: "5e5fd0fd361338004e16e71f" },
            { $oid: "5f0e0b09486954005cec1bba" },
          ],
        },
        "metadatas.frenchLevel": "A1",
      },
      {
        $set: { "metadatas.frenchLevel.$[elem]": "A1.1" },
      },
      {
        arrayFilters: [{ elem: { $eq: "A1" } }],
      },
    );
    console.log(`[Migration1777282941168] down(): restored ${result.modifiedCount} doc(s) to A1.1`);
  }
}
