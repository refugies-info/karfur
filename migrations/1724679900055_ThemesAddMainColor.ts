import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class Migration1724679449317 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    // Add the mainColor property to each theme
    await db.collection("themes").updateMany({}, { $set: { mainColor: "#FFFFFF" } });
  }

  public async down(db: Db): Promise<void | never> {
    // Remove mainColor property from each theme
    await db.collection("themes").updateMany({}, { $unset: { mainColor: "" } });
  }
}
