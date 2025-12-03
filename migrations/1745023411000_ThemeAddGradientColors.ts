import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class Migration1745023411000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    // Add the gradientColors property to each theme with default values
    await db.collection("themes").updateMany(
      {},
      {
        $set: {
          gradientColors: {
            colorTop: "#FEF7DA",
            colorBottom: "#E3E3FD",
          },
        },
      },
    );
  }

  public async down(db: Db): Promise<void | never> {
    // Remove gradientColors property from each theme
    await db.collection("themes").updateMany({}, { $unset: { gradientColors: "" } });
  }
}
