import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db, Document, ObjectId } from "mongodb";

const hasNaNAgeExpr: Document = {
  $expr: {
    $gt: [
      {
        $size: {
          $filter: {
            input: { $ifNull: ["$metadatas.age.ages", []] },
            as: "ageValue",
            // NaN is the only numeric value for which (value !== value)
            cond: { $ne: ["$$ageValue", "$$ageValue"] },
          },
        },
      },
      0,
    ],
  },
};

export class Migration1773564860648 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const dispositifs = db.collection("dispositifs");

    const docs = await dispositifs
      .find(hasNaNAgeExpr, {
        projection: { _id: 1, status: 1, typeContenu: 1, "metadatas.age": 1 },
      })
      .toArray();

    const ids = docs.map((doc) => doc._id as ObjectId);

    if (ids.length === 0) {
      console.log("[Migration1773564860648] No NaN age values found.");
      return;
    }

    const result = await dispositifs.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          "metadatas.age": null,
        },
      },
    );

    console.log(
      `[Migration1773564860648] Sanitized NaN age values on ${result.modifiedCount} dispositif(s).`,
    );
  }

  public async down(): Promise<void> {
    // No-op rollback: original BSON NaN values are not recoverable without a backup.
    console.log("[Migration1773564860648] down() is a no-op.");
  }
}
