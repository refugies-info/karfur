import { DispositifStatus } from "@refugies-info/api-types";
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db } from "mongodb";

export class CreateDispositifSnapshotsCollection1742918280024 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    // Check if collection exists
    const collections = await db.listCollections({ name: "snapshots" }).toArray();
    if (collections.length === 0) {
      // Collection doesn't exist, create it
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
      console.log("Created snapshots collection");
    } else {
      console.log("Snapshots collection already exists, skipping creation");
    }

    // Create index regardless of whether we created the collection or not
    // If index already exists with same options, this is a no-op
    // If index exists with different options, it will be dropped and recreated
    await db.collection("snapshots").createIndex({ dispositifId: 1, version: 1 }, { unique: true });
    console.log("Ensured index on snapshots collection");
  }

  public async down(db: Db): Promise<void | never> {
    // Only drop if it exists
    const collections = await db.listCollections({ name: "snapshots" }).toArray();
    if (collections.length > 0) {
      await db.dropCollection("snapshots");
      console.log("Dropped snapshots collection");
    } else {
      console.log("Snapshots collection doesn't exist, nothing to drop");
    }
  }
}
