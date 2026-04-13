import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

/**
 * Adds indexes recommended by MongoDB Atlas Performance Advisor (April 2026).
 *
 * Collections affected: logs, indicators, dispositifs
 *
 * These are the top suggestions from the Performance Advisor, sorted by expected impact:
 *   1. logs: { objectId, created_at } — reduces 269.5 MB disk reads at 1.46 queries/hour
 *   2. indicators: { dispositifId, language, userId } — 15.33 exec/hour, 133037 docs scanned per 1 returned
 *   3. dispositifs: { mainSponsor, status } — filtering by sponsor + status
 *   4. dispositifs: { status, typeContenu, nbVues } — sort by views within type+status
 */
export class AddPerformanceAdvisorIndexes21776080086167 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    // Index 1: logs — objectId + created_at (DESC)
    // Query pattern: Fetch logs for a given object, sorted by creation date
    // Impact: TOP SUGGESTION — up to 269.5 MB disk reads saved, 1314ms avg execution time
    await db
      .collection("logs")
      .createIndex({ objectId: 1, created_at: -1 }, { name: "objectId_1_created_at_-1" });

    // Index 2: indicators — dispositifId + language + userId
    // Query pattern: Look up indicator for a specific dispositif/language/user combination
    // Impact: 15.33 exec/hour, 133037 docs scanned per 1 returned (very high ratio)
    await db
      .collection("indicators")
      .createIndex(
        { dispositifId: 1, language: 1, userId: 1 },
        { name: "dispositifId_1_language_1_userId_1" },
      );

    // Index 3: dispositifs — mainSponsor + status
    // Query pattern: Fetch dispositifs filtered by their main sponsor and publication status
    // Impact: 171ms avg execution time
    await db
      .collection("dispositifs")
      .createIndex({ mainSponsor: 1, status: 1 }, { name: "mainSponsor_1_status_1" });

    // Index 4: dispositifs — status + typeContenu + nbVues (DESC)
    // Query pattern: List dispositifs of a given type and status, sorted by view count
    // Impact: 502ms avg execution time
    await db
      .collection("dispositifs")
      .createIndex(
        { status: 1, typeContenu: 1, nbVues: -1 },
        { name: "status_1_typeContenu_1_nbVues_-1" },
      );
  }

  public async down(db: Db): Promise<void> {
    const INDEX_NOT_FOUND_CODE = 27;
    const drop = async (collection: string, indexName: string) => {
      await db
        .collection(collection)
        .dropIndex(indexName)
        .catch((err: any) => {
          if (err?.code !== INDEX_NOT_FOUND_CODE) throw err;
        });
    };

    await drop("logs", "objectId_1_created_at_-1");
    await drop("indicators", "dispositifId_1_language_1_userId_1");
    await drop("dispositifs", "mainSponsor_1_status_1");
    await drop("dispositifs", "status_1_typeContenu_1_nbVues_-1");
  }
}
