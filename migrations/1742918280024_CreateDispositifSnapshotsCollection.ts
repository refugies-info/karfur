import { DispositifStatus } from "@refugies-info/api-types";
import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class CreateDispositifSnapshotsCollection1742918280024 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    await db.createCollection("snapshots", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["_id", "dispositifId", "version", "createdAt", "type", "from", "to", "data"],
          properties: {
            _id: {
              bsonType: "objectId",
              description: "must be an objectId and is required",
            },
            dispositifId: {
              bsonType: "objectId",
              description: "must be an objectId and is required",
            },
            version: {
              bsonType: "int",
              minimum: 1,
              description: "must be an integer >= 1 and is required",
            },
            createdAt: {
              bsonType: "date",
              description: "must be a date and is required",
            },
            type: {
              bsonType: "string",
              enum: ["before", "after"],
              description: "must be either before or after",
            },
            from: {
              bsonType: "string",
              enum: Object.values(DispositifStatus),
              description: "previous state of the dispositif",
            },
            to: {
              bsonType: "string",
              enum: Object.values(DispositifStatus),
              description: "new state of the dispositif",
            },
            data: {
              bsonType: "object",
              description: "complete copy of the dispositif document",
            },
          },
        },
      },
    });

    await db.collection("snapshots").createIndex({ dispositifId: 1, version: 1 }, { unique: true });
  }

  public async down(db: Db): Promise<void | never> {
    await db.dropCollection("snapshots");
  }
}
