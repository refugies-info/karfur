import { config } from "dotenv";
import { mongoMigrateCli } from "mongo-migrate-ts";

config();

const { MIGRATE_MONGO_URI } = process.env;

mongoMigrateCli({
  uri: MIGRATE_MONGO_URI,
  migrationsDir: __dirname,
  migrationsCollection: "migrations",
});
