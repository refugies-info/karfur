import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Migration: sessions array → SessionsMetadata object
 *
 * Converts metadatas.sessions from the old flat array format:
 *   sessions: [{ startDate, endDate, ... }]
 *
 * To the new wrapper object format:
 *   sessions: { modalitesEntreesSorties?: 0|1|null, items: [{ startDate, endDate, ... }] }
 *
 * Only affects dispositifs where metadatas.sessions is an array (old format).
 * Dispositifs without sessions, or already in the new format, are untouched.
 */
export class MigrateSessionsToObject1772529648826 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collection = db.collection("dispositifs");

    // Find dispositifs where sessions is an array (old format)
    const cursor = collection.find({
      "metadatas.sessions": { $type: "array" },
    });

    let migratedCount = 0;

    for await (const dispositif of cursor) {
      const sessionsArray = dispositif.metadatas?.sessions;

      await collection.updateOne(
        { _id: dispositif._id },
        {
          $set: {
            "metadatas.sessions": {
              items: sessionsArray,
            },
          },
        },
      );

      migratedCount++;
    }

    console.log(
      `[MigrateSessionsToObject] Migrated ${migratedCount} dispositif(s) from sessions array to SessionsMetadata object.`,
    );
  }

  public async down(db: Db): Promise<void | never> {
    const collection = db.collection("dispositifs");

    // Find dispositifs where sessions is an object (new format)
    const cursor = collection.find({
      "metadatas.sessions": { $type: "object" },
      "metadatas.sessions.items": { $exists: true },
    });

    let revertedCount = 0;

    for await (const dispositif of cursor) {
      const sessionsObject = dispositif.metadatas?.sessions;

      await collection.updateOne(
        { _id: dispositif._id },
        {
          $set: {
            "metadatas.sessions": sessionsObject.items ?? [],
          },
        },
      );

      revertedCount++;
    }

    console.log(
      `[MigrateSessionsToObject] Reverted ${revertedCount} dispositif(s) from SessionsMetadata object back to sessions array.`,
    );
  }
}
