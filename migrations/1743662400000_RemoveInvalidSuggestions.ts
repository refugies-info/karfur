import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db, Document, ObjectId } from "mongodb";

// Find dispositifs with invalid suggestions (empty or whitespace-only suggestion field)
const hasInvalidSuggestionsExpr: Document = {
  $expr: {
    $gt: [
      {
        $size: {
          $filter: {
            input: { $ifNull: ["$suggestions", []] },
            as: "suggestion",
            // Invalid: empty string or whitespace-only
            cond: {
              $or: [
                { $eq: ["$$suggestion.suggestion", ""] },
                {
                  $eq: [
                    {
                      $trim: { input: "$$suggestion.suggestion" },
                    },
                    "",
                  ],
                },
                { $eq: ["$$suggestion.suggestion", null] },
              ],
            },
          },
        },
      },
      0,
    ],
  },
};

export class Migration1743662400000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const dispositifs = db.collection("dispositifs");

    // Find all dispositifs with invalid suggestions
    const docs = await dispositifs
      .find(hasInvalidSuggestionsExpr, {
        projection: { _id: 1, status: 1, typeContenu: 1, suggestions: 1 },
      })
      .toArray();

    if (docs.length === 0) {
      console.log("[Migration1743662400000] No invalid suggestions found.");
      return;
    }

    console.log(
      `[Migration1743662400000] Found ${docs.length} dispositif(s) with invalid suggestions.`,
    );

    // For each document, filter out invalid suggestions
    let totalRemoved = 0;
    for (const doc of docs) {
      const validSuggestions = (doc.suggestions || []).filter(
        (s: { suggestion?: string }) => s.suggestion && s.suggestion.trim() !== "",
      );
      const removedCount = (doc.suggestions?.length || 0) - validSuggestions.length;

      if (validSuggestions.length !== doc.suggestions?.length) {
        await dispositifs.updateOne(
          { _id: doc._id as ObjectId },
          { $set: { suggestions: validSuggestions } },
        );
        totalRemoved += removedCount;
        console.log(
          `[Migration1743662400000] Fixed ${doc._id}: removed ${removedCount} invalid suggestion(s)`,
        );
      }
    }

    console.log(
      `[Migration1743662400000] Removed ${totalRemoved} invalid suggestion(s) from ${docs.length} dispositif(s).`,
    );
  }

  public async down(): Promise<void> {
    // No-op rollback: we cannot recover the removed invalid suggestions
    console.log("[Migration1743662400000] down() is a no-op.");
  }
}
