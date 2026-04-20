/**
 * Utility functions for handling Mongoose Map types
 *
 * Mongoose stores Maps as subdocuments with internal tracking properties.
 * These utilities safely convert Maps to plain JavaScript objects and handle
 * both Map and plain object cases uniformly.
 */

/**
 * Check if a value is a Mongoose Map (has entries method)
 * Checks for both `entries` and `get` methods and excludes Arrays
 * to avoid false positives from Arrays, Sets, and other iterables.
 */
export const isMongooseMap = (value: unknown): boolean => {
  return (
    !!value &&
    !Array.isArray(value) &&
    typeof (value as any)?.entries === "function" &&
    typeof (value as any)?.get === "function"
  );
};

/**
 * Convert a Mongoose Map or plain object to a plain JavaScript object
 *
 * @param value - The value to convert (Map or plain object)
 * @returns A plain object copy with all key-value pairs
 */
export const mapToPlainObject = <T = any>(
  value: Record<string, T> | Map<string, T> | undefined,
): Record<string, T> => {
  if (!value) return {};

  // Prefer Mongoose's own conversion for documents/subdocuments.
  if (typeof (value as any)?.toObject === "function") {
    return (value as any).toObject({ flattenMaps: true }) as Record<string, T>;
  }

  if (isMongooseMap(value)) {
    return Object.fromEntries((value as Map<string, T>).entries());
  }

  // Always return a copy to avoid in-place mutations on the original
  return { ...value } as Record<string, T>;
};

/**
 * Get a value from a Mongoose Map or plain object by key
 *
 * @param value - The Map or plain object
 * @param key - The key to look up
 * @returns The value at the key, or undefined if not found
 */
export const getMapValue = <T = any>(
  value: Record<string, T> | Map<string, T> | undefined,
  key: string,
): T | undefined => {
  if (!value) return undefined;

  if (isMongooseMap(value)) {
    return (value as Map<string, T>).get(key);
  }

  return (value as Record<string, T>)[key];
};

/**
 * Get all keys from a Mongoose Map or plain object
 *
 * @param value - The Map or plain object
 * @returns Array of keys
 */
export const getMapKeys = (
  value: Record<string, unknown> | Map<string, unknown> | undefined,
): string[] => {
  if (!value) return [];

  if (isMongooseMap(value)) {
    return Array.from((value as Map<string, unknown>).keys());
  }

  return Object.keys(value);
};

/**
 * Check if a Mongoose Map or plain object has a key
 *
 * @param value - The Map or plain object
 * @param key - The key to check
 * @returns True if the key exists
 */
export const hasMapKey = (
  value: Record<string, unknown> | Map<string, unknown> | undefined,
  key: string,
): boolean => {
  if (!value) return false;

  if (isMongooseMap(value)) {
    return (value as Map<string, unknown>).has(key);
  }

  return Object.hasOwn(value, key);
};
