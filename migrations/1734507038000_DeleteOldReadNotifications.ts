import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class DeleteOldReadNotifications1734507038000 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    await db.collection("notifications").deleteMany({
      seen: true,
      createdAt: { $lt: oneYearAgo },
    });
  }

  public async down(db: Db): Promise<void> {
    // This migration is not reversible.
  }
}
