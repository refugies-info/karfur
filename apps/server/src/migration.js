/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");

/*
  Script which can be used to perform modifications on database
  To use it:
    1. change dbPath to target the right environment
    2. (optional) if we need to read a csv file, we can do it now
    3. get the right collections to get and write data
    4. write the changes to apply in the performChanges function
    5. run it in your console with `node src/migration.js`
*/

const dbPath = "mongodb://127.0.0.1:27017/heroku_wbj38s57?serverSelectionTimeoutMS=60000"; // 1. Change dbPath
const client = new MongoClient(dbPath);
const dbName = "heroku_wbj38s57";

// 4. Write changes to apply here
const performChanges = async (dispositifsColl) => {
  const dispositifs = await dispositifsColl.find({ status: { $ne: "Supprimé" } }).toArray();
};

async function main() {
  await client.connect();
  console.log("Démarrage ...");
  const db = client.db(dbName);

  // 2. (optional) Read a csv file here
  // const data = fs.readFileSync("./temp/import.csv", "utf-8");
  // const lines = data.split(/\n/);

  // 3. Get the right collections
  const dispositifsColl = db.collection("dispositifs");
  await performChanges(dispositifsColl);

  console.log("C'est tout bon !");
}

main()
  .catch(console.error)
  .finally(() => client.close());
