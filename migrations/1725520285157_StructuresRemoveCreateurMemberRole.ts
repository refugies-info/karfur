import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresRemoveCreateurMemberRole1725520285157 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collection = db.collection("structures");

    // Remove "createur" value from the roles array of membres items
    // @ts-ignore
    await collection.updateMany({ membres: { $exists: true } }, { $pull: { membres: { roles: "createur" } } });
  }

  public async down(db: Db): Promise<void | never> {
    // No down migration provided
  }
}
