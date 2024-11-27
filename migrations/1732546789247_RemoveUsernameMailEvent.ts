import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class Migration1732546789247 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.collection("mails").updateMany({}, { $unset: { username: "" } });
  }

  public async down(db: Db): Promise<void | never> {}
}
