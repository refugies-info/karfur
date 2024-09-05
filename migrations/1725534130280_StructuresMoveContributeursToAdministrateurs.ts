import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresMoveContributeursToAdministrateurs1725534130280 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const collection = db.collection("structures");

    await collection.updateMany({ "membres.roles": "contributeur" }, [
      {
        $set: {
          membres: {
            $map: {
              input: "$membres",
              as: "membre",
              in: {
                $mergeObjects: [
                  "$$membre",
                  {
                    roles: {
                      $map: {
                        input: "$$membre.roles",
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
                ],
              },
            },
          },
        },
      },
    ]);
  }

  public async down(db: Db): Promise<void | never> {}
}
