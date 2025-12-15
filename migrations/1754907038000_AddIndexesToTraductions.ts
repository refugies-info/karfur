import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class AddIndexesToTraductions1754907038000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    await db.collection("traductions").createIndex({ dispositifId: 1, language: 1 });
    await db.collection("traductions").createIndex({ type: 1 });
    await db.collection("traductions").createIndex({ userId: 1 });
  }

  public async down(db: Db): Promise<void> {
    await db.collection("traductions").dropIndex("dispositifId_1_language_1");
    await db.collection("traductions").dropIndex("type_1");
    await db.collection("traductions").dropIndex("userId_1");
  }
}
