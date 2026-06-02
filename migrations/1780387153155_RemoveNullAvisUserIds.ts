import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: remove explicit null userId fields from avis subdocuments.
 *
 * Anonymous feedbacks should store anonymousUserId and omit userId entirely.
 * Legacy documents may contain `avis[].userId: null`, which is invalid with
 * the Zod/Mongoose schema (`userId` is optional, not nullable) and can break
 * autosave when an active dispositif is cloned into dispositifs_draft.
 */
export class Migration1780387153155 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const collectionsToClean = ["dispositifs", "dispositifs_draft"];

    let totalMatched = 0;
    let totalModified = 0;

    for (const collectionName of collectionsToClean) {
      const collection = db.collection(collectionName);
      const query = { avis: { $elemMatch: { userId: { $type: "null" } } } };

      const result = await collection.updateMany(
        query,
        { $unset: { "avis.$[elem].userId": "" } },
        { arrayFilters: [{ "elem.userId": { $type: "null" } }] },
      );

      totalMatched += result.matchedCount;
      totalModified += result.modifiedCount;

      console.log(
        "[Migration1780387153155] " +
          collectionName +
          ": removed null avis.userId from " +
          result.modifiedCount +
          "/" +
          result.matchedCount +
          " document(s)",
      );
    }

    console.log(
      `[Migration1780387153155] Total: cleaned ${totalModified}/${totalMatched} document(s)`,
    );
  }

  public async down(): Promise<void> {
    // No-op: cannot recover which anonymous feedbacks originally had userId: null.
    console.log("[Migration1780387153155] down() is a no-op.");
  }
}
