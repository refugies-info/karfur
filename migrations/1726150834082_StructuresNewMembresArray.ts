import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class StructuresNewMembresArray1726150834082 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.collection("structures").updateMany({ "membres.userId": { $exists: true } }, [
      {
        $set: {
          membres: {
            $map: {
              input: "$membres",
              as: "membre",
              in: {
                userId: "$$membre.userId",
                added_at: "$$membre.added_at",
              },
            },
          },
        },
      },
    ]);
  }

  public async down(db: Db): Promise<void | never> {}
}
