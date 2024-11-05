import { config } from "dotenv";
import { mongoMigrateCli } from "mongo-migrate-ts";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const { MIGRATE_MONGO_URI } = process.env;

mongoMigrateCli({
  uri: MIGRATE_MONGO_URI,
  migrationsDir: __dirname,
  migrationsCollection: "migrations",
});
