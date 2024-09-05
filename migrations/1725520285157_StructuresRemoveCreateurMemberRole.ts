import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresRemoveCreateurMemberRole1725520285157 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collection = db.collection("structures");

    // Delete any createur roles
    await collection.updateMany(
      { "membres.roles": "createur" },
      {
        $set: {
          "membres.$[elem].roles": {
            $filter: {
              input: "$membres.roles",
              as: "role",
              cond: { $ne: ["$$role", "createur"] },
            },
          },
        },
      },
      {
        arrayFilters: [{ "elem.roles": "createur" }],
      },
    );
  }

  public async down(db: Db): Promise<void | never> {}
}
