import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("dispositifs").createIndex({ "metadatas.updatedAt": -1 });
  await db.collection("dispositifs").createIndex({ "metadatas.vues": -1 });
  await db.collection("dispositifs").createIndex({ theme: 1 });
  await db.collection("dispositifs").createIndex({ "metadatas.location": 1 });
};

export const down = async (db: Db, _client: MongoClient) => {
  await db.collection("dispositifs").dropIndex("metadatas.updatedAt_-1");
  await db.collection("dispositifs").dropIndex("metadatas.vues_-1");
  await db.collection("dispositifs").dropIndex("theme_1");
  await db.collection("dispositifs").dropIndex("metadatas.location_1");
};
