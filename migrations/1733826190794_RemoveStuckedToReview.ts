import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1733826190794 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const trads = await db
      .collection("traductions")
      .find({ toReview: "content.administrationName" })
      .toArray();
    for (const trad of trads) {
      const dispositif = await db.collection("dispositifs").findOne({ _id: trad.dispositifId });
      if (dispositif && dispositif.translations.fr.content.administrationName === null) {
        //@ts-expect-error
        await db.collection("traductions").updateOne(
          { _id: trad._id },
          {
            $pull: {
              toReview: "content.administrationName",
              toReviewCache: "content.administrationName",
            },
          },
        );
      }
    }
  }

  public async down(db: Db): Promise<void | never> {}
}
