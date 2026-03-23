import mongoose from "mongoose";
import type { SpeedGooseConfig } from "speedgoose";
import { applySpeedGooseCacheLayer, SharedCacheStrategies } from "speedgoose";

let cacheInitialized = false;

/**
 * Initializes the speedgoose write-through cache layer on the global Mongoose connection.
 *
 * - When `redisUri` is provided, uses Redis as the shared cache backend (production/staging).
 * - When `redisUri` is omitted, uses in-memory caching (local dev, CI).
 * - When called multiple times, subsequent calls are no-ops.
 *
 * Must be called AFTER `mongoose.connect()` and BEFORE any cached queries.
 */
export const initCache = async (redisUri?: string): Promise<void> => {
  if (cacheInitialized) return;

  const config: SpeedGooseConfig = {
    defaultTtl: 300, // 5 minutes
  };

  if (redisUri) {
    config.redisUri = redisUri;
  } else {
    // In-memory fallback for local dev and CI (no Redis dependency required)
    config.sharedCacheStrategy = SharedCacheStrategies.IN_MEMORY;
  }

  await applySpeedGooseCacheLayer(mongoose, config);
  cacheInitialized = true;
};

/**
 * Returns whether the cache layer has been initialized.
 * Useful for health checks.
 */
export const isCacheInitialized = (): boolean => cacheInitialized;
