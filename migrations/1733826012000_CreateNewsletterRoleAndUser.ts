import type { MigrationInterface } from "mongo-migrate-ts";
import { type Db, ObjectId } from "mongodb";

export class Migration1733826012000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    // Create newsletter role
    const newsletterRole = {
      _id: new ObjectId(),
      nom: "newsletter",
      nomPublique: "Gestionnaire de newsletter",
    };

    await db.collection("roles").insertOne(newsletterRole);

    // Create newsletter user
    const newsletterUser = {
      _id: new ObjectId(),
      username: "newsletter",
      email: "",
      password: "",
      roles: [newsletterRole._id],
      created_at: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(newsletterUser);
  }

  public async down(db: Db): Promise<void | never> {
    // Remove newsletter user
    await db.collection("users").deleteOne({ username: "newsletter" });

    // Remove newsletter role
    await db.collection("roles").deleteOne({ nom: "newsletter" });
  }
}
