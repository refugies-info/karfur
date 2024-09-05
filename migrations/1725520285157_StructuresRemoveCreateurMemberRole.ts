import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresRemoveCreateurMemberRole1725520285157 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {}

  public async down(db: Db): Promise<void | never> {}
}
