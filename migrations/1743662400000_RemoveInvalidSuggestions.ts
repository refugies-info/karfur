import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db, ObjectId } from "mongodb";

export class Migration1743662400000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const dispositifs = db.collection("dispositifs");

    // Find dispositifs with invalid suggestions using $elemMatch (safer than $expr)
    // $expr with $trim would crash on null values
    const query = {
      suggestions: {
        $elemMatch: {
          $or: [{ suggestion: null }, { suggestion: "" }, { suggestion: { $regex: /^\s+$/ } }],
        },
      },
    };

    // Use cursor for memory efficiency
    const cursor = dispositifs.find(query, {
      projection: { _id: 1, suggestions: 1 },
    });

    const bulkOps: {
      updateOne: { filter: { _id: ObjectId }; update: { $set: { suggestions: unknown[] } } };
    }[] = [];
    let totalRemoved = 0;
    let docCount = 0;

    // Iterate using cursor to avoid memory issues with large datasets
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
        docCount++;
      }
    }

    if (bulkOps.length === 0) {
      console.log("[Migration1743662400000] No invalid suggestions found.");
      return;
    }

    // Use bulkWrite for efficient batch updates
    const result = await dispositifs.bulkWrite(bulkOps);

    console.log(
      `[Migration1743662400000] Removed ${totalRemoved} invalid suggestion(s) from ${result.modifiedCount} dispositif(s).`,
    );
  }

  public async down(): Promise<void> {
    // No-op rollback: we cannot recover the removed invalid suggestions
    console.log("[Migration1743662400000] down() is a no-op.");
  }
}
