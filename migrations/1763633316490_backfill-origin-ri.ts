import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class backfillOriginRi1763633316490 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const result = await db
      .collection("dispositifs")
      .updateMany({ origin: { $exists: false } }, { $set: { origin: "RI" } });
    console.log(`Backfilled ${result.modifiedCount} dispositifs with origin: RI`);
  }

  public async down(db: Db): Promise<void | never> {
    await db.collection("dispositifs").updateMany({ origin: "RI" }, { $unset: { origin: "" } });
  }
}
