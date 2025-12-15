import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

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

    // Helper to check by name; we want to create our partial indexes even if a non-partial
    // index with the same key already exists. Using names avoids accidentally skipping them.
    const existingNames = new Set((existing || []).map((idx: any) => idx.name).filter(Boolean));

    const specs: Array<{ key: Record<string, 1>; name: string }> = [
      { key: { "metadatas.location": 1 }, name: "metadatas.location_1_counts" },
      // Theme and needs fields used by counts API
      { key: { theme: 1 }, name: "theme_1_counts" },
      { key: { secondaryThemes: 1 }, name: "secondaryThemes_1_counts" },
      { key: { needs: 1 }, name: "needs_1_counts" },
      { key: { "metadatas.frenchLevel": 1 }, name: "metadatas.frenchLevel_1_counts" },
      { key: { "metadatas.public": 1 }, name: "metadatas.public_1_counts" },
      // New: filter by refugee public statuses used in counts API
      { key: { "metadatas.publicStatus": 1 }, name: "metadatas.publicStatus_1_counts" },
      { key: { "metadatas.status": 1 }, name: "metadatas.status_1_counts" },
      { key: { availableLanguages: 1 }, name: "availableLanguages_1_counts" },
      { key: { typeContenu: 1 }, name: "typeContenu_1_counts" },
    ];

    for (const { key, name } of specs) {
      if (!existingNames.has(name)) {
        await coll.createIndex(key, { ...partial, name });
      }
    }

    // Optional: wildcard index to efficiently support translations.<lng> existence checks
    // Wrapped in try/catch in case the target cluster does not support wildcard indexes.
    if (!existingNames.has("translations_wildcard_counts")) {
      try {
        await coll.createIndex(
          { "translations.$**": 1 },
          { ...partial, name: "translations_wildcard_counts" },
        );
      } catch (_) {
        // Ignore if not supported; the app can fall back to availableLanguages index
      }
    }

    // Note: _id already has a default index and is used when filtering Algolia IDs
    // Age filters use $expr on nested fields; no efficient index will be used by that expression.
  }

  public async down(db: Db): Promise<void> {
    const coll = db.collection("dispositifs");

    // Drop only the indexes created by this migration
    await coll.dropIndex("metadatas.location_1_counts").catch(() => undefined);
    await coll.dropIndex("theme_1_counts").catch(() => undefined);
    await coll.dropIndex("secondaryThemes_1_counts").catch(() => undefined);
    await coll.dropIndex("needs_1_counts").catch(() => undefined);
    await coll.dropIndex("metadatas.frenchLevel_1_counts").catch(() => undefined);
    await coll.dropIndex("metadatas.public_1_counts").catch(() => undefined);
    await coll.dropIndex("metadatas.publicStatus_1_counts").catch(() => undefined);
    await coll.dropIndex("metadatas.status_1_counts").catch(() => undefined);
    await coll.dropIndex("availableLanguages_1_counts").catch(() => undefined);
    await coll.dropIndex("typeContenu_1_counts").catch(() => undefined);
    await coll.dropIndex("translations_wildcard_counts").catch(() => undefined);

    // Do not drop the base status index unconditionally (it may pre-exist)
  }
}
