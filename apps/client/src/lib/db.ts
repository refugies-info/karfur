import mongoose from "mongoose";

// Note: Do NOT validate MONGODB_URI at module load time.
// In tests and some CI contexts (e.g., PRs from forks), this env var may be absent
// because we use an in-memory MongoDB server. We validate only when connecting.
const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Registers shared models from @refugies-info/mongo on the global mongoose connection.
 * This ensures all API routes and SSR code use the canonical schemas with proper
 * middleware hooks (required for speedgoose auto-cleaner).
 *
 * Only imports once — subsequent calls are no-ops because mongoose.model() checks
 * if the model is already registered.
 */
async function registerSharedModels() {
  // Dynamic import to avoid loading at module parse time (server-only code).
  // The import triggers @zodyac/zod-mongoose extendZod() and registers all models.
  await import("@refugies-info/mongo");
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongoose) => {
      await registerSharedModels();
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
