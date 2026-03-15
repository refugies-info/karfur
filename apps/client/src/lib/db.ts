import mongoose from "mongoose";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

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
async function registerSharedModelsAndCache() {
  // During next build, page-data collection can import server-side modules in a
  // constrained context where schema registration is not required.
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return;
  }

  try {
    // Dynamic import to avoid loading at module parse time (server-only code).
    // The import triggers @zodyac/zod-mongoose extendZod() and registers all models.
    const { initCache } = await import("@refugies-info/mongo");
    await initCache(process.env.REDIS_URI);
  } catch (error) {
    // Keep the app available even if shared model bootstrap fails in a given
    // runtime (e.g. bundling edge-cases). Search API routes include degraded
    // fallbacks that operate with lightweight models and uncached queries.
    console.warn("[db] Shared model/cache bootstrap skipped", error);
  }
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
      await registerSharedModelsAndCache();
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
