import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresMoveContributeursToAdministrateurs1725534130280 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collection = db.collection("structures");

    await collection.updateMany(
      { "membres.roles": "contributeur" },
      {
        $set: {
          "membres.$[elem].roles": {
            $map: {
              input: "$$elem.roles",
              as: "role",
              in: {
                $cond: {
                  if: { $eq: ["$$role", "contributeur"] },
                  then: "administrateur",
                  else: "$$role",
                },
              },
            },
          },
        },
      },
      {
        arrayFilters: [{ "elem.roles": "contributeur" }],
      },
    );
  }

  public async down(db: Db): Promise<void | never> {}
}
