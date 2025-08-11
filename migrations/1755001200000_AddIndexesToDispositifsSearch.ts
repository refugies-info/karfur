import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

/**
 * Adds indexes to support search counts aggregation in:
 * - apps/client/src/pages/api/search/counts.ts
 *
 * Strategy:
 * - Partial indexes restricted to { status: "Actif" } to match our constant filter and keep indexes small
 * - Single-field indexes per filtered field so they can be combined across different facets/pipelines
 * - A base index on { status: 1 } to speed up queries that only constrain status (e.g., total/types facets with no other filters)
 */
export class AddIndexesToDispositifsSearch1755001200000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const coll = db.collection("dispositifs");

    // Base status index (check first to avoid conflicts)
    const existing = await coll.indexes();
    const hasStatusIndex = existing.some((idx: any) => idx.key && idx.key.status === 1);
    if (!hasStatusIndex) {
      await coll.createIndex({ status: 1 }, { name: "status_1" });
    }

    // Partial indexes for common filters used in buildBaseMatch()
    const partial = { partialFilterExpression: { status: "Actif" } } as const;

    // Helper to check if an index with the same key already exists (regardless of options)
    const hasKey = (key: Record<string, 1 | -1>) =>
      existing.some((idx: any) => JSON.stringify(idx.key) === JSON.stringify(key));

    const specs: Array<{ key: Record<string, 1>; name: string }> = [
      { key: { "metadatas.location": 1 }, name: "metadatas.location_1__actif" },
      { key: { thematiques: 1 }, name: "thematiques_1__actif" },
      { key: { besoins: 1 }, name: "besoins_1__actif" },
      { key: { "metadatas.frenchLevel": 1 }, name: "metadatas.frenchLevel_1__actif" },
      { key: { "metadatas.public": 1 }, name: "metadatas.public_1__actif" },
      { key: { "metadatas.status": 1 }, name: "metadatas.status_1__actif" },
      { key: { availableLanguages: 1 }, name: "availableLanguages_1__actif" },
      { key: { typeContenu: 1 }, name: "typeContenu_1__actif" },
    ];

    for (const { key, name } of specs) {
      if (!hasKey(key)) {
        await coll.createIndex(key, { ...partial, name });
      }
    }

    // Note: _id already has a default index and is used when filtering Algolia IDs
    // Age filters use $expr on nested fields; no efficient index will be used by that expression.
  }

  public async down(db: Db): Promise<void> {
    const coll = db.collection("dispositifs");

    // Drop only the indexes created by this migration
    await coll.dropIndex("metadatas.location_1__actif").catch(() => undefined);
    await coll.dropIndex("thematiques_1__actif").catch(() => undefined);
    await coll.dropIndex("besoins_1__actif").catch(() => undefined);
    await coll.dropIndex("metadatas.frenchLevel_1__actif").catch(() => undefined);
    await coll.dropIndex("metadatas.public_1__actif").catch(() => undefined);
    await coll.dropIndex("metadatas.status_1__actif").catch(() => undefined);
    await coll.dropIndex("availableLanguages_1__actif").catch(() => undefined);
    await coll.dropIndex("typeContenu_1__actif").catch(() => undefined);

    // Do not drop the base status index unconditionally (it may pre-exist)
  }
}
