import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1755535200000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.collection("dispositifs").createIndex({ "metadatas.updatedAt": -1 });
    await db.collection("dispositifs").createIndex({ "metadatas.vues": -1 });
    await db.collection("dispositifs").createIndex({ theme: 1 });
    await db.collection("dispositifs").createIndex({ "metadatas.location": 1 });
  }

  public async down(db: Db): Promise<void | never> {
    await db.collection("dispositifs").dropIndex("metadatas.updatedAt_-1");
    await db.collection("dispositifs").dropIndex("metadatas.vues_-1");
    await db.collection("dispositifs").dropIndex("theme_1");
    await db.collection("dispositifs").dropIndex("metadatas.location_1");
  }
}
