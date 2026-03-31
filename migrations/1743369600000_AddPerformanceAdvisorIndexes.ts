import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Adds indexes recommended by MongoDB Performance Advisor
 * to reduce disk reads for high-frequency queries.
 */
export class AddPerformanceAdvisorIndexes1743369600000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Index 1: appusers - expoPushToken + uid
    // Query pattern: Find users by expoPushToken with uid projection
    // Impact: ~50.42 queries/hour, up to 100.1 MB disk reads saved
    await db
      .collection("appusers")
      .createIndex({ expoPushToken: 1, uid: 1 }, { name: "expoPushToken_1_uid_1" });

    // Index 2: dispositifs - frenchLevel + status + webOnly
    // Query pattern: Search filtering by french level, status, and webOnly flag
    // Impact: ~0.5 queries/hour, up to 138.7 MB disk reads saved
    await db
      .collection("dispositifs")
      .createIndex(
        { "metadatas.frenchLevel": 1, status: 1, webOnly: 1 },
        { name: "metadatas.frenchLevel_1_status_1_webOnly_1" },
      );
  }

  public async down(db: Db): Promise<void> {
    // Only ignore IndexNotFound errors — the index may not exist in some environments.
    // Using codeName is more readable than the numeric error code 27.
    await db
      .collection("appusers")
      .dropIndex("expoPushToken_1_uid_1")
      .catch((err: { codeName?: string }) => {
        if (err.codeName !== "IndexNotFound") throw err;
      });
    await db
      .collection("dispositifs")
      .dropIndex("metadatas.frenchLevel_1_status_1_webOnly_1")
      .catch((err: { codeName?: string }) => {
        if (err.codeName !== "IndexNotFound") throw err;
      });
  }
}
