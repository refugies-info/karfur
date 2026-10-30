import { DispositifStatus } from "@refugies-info/api-types";
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

const buildSnapshotsValidator = (createdAtField: "created_at" | "createdAt") => ({
  $jsonSchema: {
    bsonType: "object",
    required: ["_id", "dispositifId", "version", createdAtField, "type", "from", "to", "data"],
    properties: {
      _id: { bsonType: "objectId" },
      dispositifId: { bsonType: "objectId" },
      version: { bsonType: "int", minimum: 1 },
      [createdAtField]: { bsonType: "date" },
      type: { bsonType: "string", enum: ["before", "after"] },
      from: { bsonType: "string", enum: Object.values(DispositifStatus) },
      to: { bsonType: "string", enum: Object.values(DispositifStatus) },
      data: { bsonType: "object" },
    },
  },
});

export class FixSnapshotsValidator1791202735000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.command({ collMod: "snapshots", validator: buildSnapshotsValidator("created_at") });
  }

  public async down(db: Db): Promise<void | never> {
    await db.command({ collMod: "snapshots", validator: buildSnapshotsValidator("createdAt") });
  }
}
