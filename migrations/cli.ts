import { config } from "dotenv";
import { mongoMigrateCli } from "mongo-migrate-ts";
import path from "path";
import { fileURLToPath } from "url";

config();

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { MIGRATE_MONGO_URI } = process.env;

mongoMigrateCli({
  uri: MIGRATE_MONGO_URI,
  migrationsDir: __dirname,
  migrationsCollection: "migrations",
  // Only timestamped files: matching cli.ts would re-run this CLI and apply every migration twice.
  globPattern: "[0-9]*_*.ts",
});
