import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class SetWebOnlyFalseForRCOActif1781081221916 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const result = await db
      .collection("dispositifs")
      .updateMany({ origin: "RCO" }, { $set: { webOnly: false } });
    console.log(`Set webOnly: false on ${result.modifiedCount} RCO Actif dispositifs`);
  }

  public async down(db: Db): Promise<void | never> {
    await db
      .collection("dispositifs")
      .updateMany({ origin: "RCO", webOnly: false }, { $unset: { webOnly: "" } });
  }
}
