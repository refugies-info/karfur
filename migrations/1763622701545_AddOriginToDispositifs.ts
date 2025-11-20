import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class Migration1763622701545 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.collection("dispositifs").updateMany({}, { $set: { origin: "RI" } });
  }

  public async down(db: Db): Promise<void | never> {
    await db.collection("dispositifs").updateMany({}, { $unset: { origin: "" } });
  }
}
