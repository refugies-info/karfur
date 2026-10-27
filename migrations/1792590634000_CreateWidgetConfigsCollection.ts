import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

const COLLECTION = "widget_config";
const log = (message: string) => console.log(`[Migration1792590634000] ${message}`);

/**
 * Migration: create the collection of the widget configs (WidgetConfig in @refugies-info/mongo)
 * with the unique index on publicId, the identifier used by the embed code.
 *
 * The index has the default name and options Mongoose gives it (publicId_1, unique), so Mongoose
 * finds it already in place when the models start.
 */
export class CreateWidgetConfigsCollection1792590634000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collections = await db.listCollections({ name: COLLECTION }).toArray();
    if (collections.length === 0) {
      await db.createCollection(COLLECTION);
      log(`Created ${COLLECTION} collection`);
    } else {
      log(`${COLLECTION} collection already exists, skipping creation`);
    }

    // No-op if the index already exists with the same options
    await db.collection(COLLECTION).createIndex({ publicId: 1 }, { unique: true });
    log("Ensured the unique index on publicId");
  }

  public async down(db: Db): Promise<void | never> {
    const collections = await db.listCollections({ name: COLLECTION }).toArray();
    if (collections.length > 0) {
      await db.dropCollection(COLLECTION);
      log(`Dropped ${COLLECTION} collection`);
    } else {
      log(`${COLLECTION} collection doesn't exist, nothing to drop`);
    }
  }
}
