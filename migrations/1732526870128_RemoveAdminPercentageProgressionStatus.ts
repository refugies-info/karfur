import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1732526870128 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db
      .collection("dispositifs")
      .updateMany({}, { $unset: { adminPercentageProgressionStatus: "" } });
    await db
      .collection("dispositifs_draft")
      .updateMany({}, { $unset: { adminPercentageProgressionStatus: "" } });
  }

  public async down(db: Db): Promise<void | never> {}
}
