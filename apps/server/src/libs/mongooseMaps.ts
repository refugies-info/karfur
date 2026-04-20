/**
 * Utility functions for handling Mongoose Map types
 *
 * Mongoose stores Maps as subdocuments with internal tracking properties.
 * These utilities safely convert Maps to plain JavaScript objects and handle
 * both Map and plain object cases uniformly.
 */

/**
 * Check if a value is a Mongoose Map (has entries method)
 */
export const isMongooseMap = (value: unknown): boolean => {
  return typeof (value as any)?.entries === "function";
};

/**
 * Convert a Mongoose Map or plain object to a plain JavaScript object
 *
 * @param value - The value to convert (Map or plain object)
 * @returns A plain object with all key-value pairs
 */
export const mapToPlainObject = <T = unknown>(
  value: Record<string, T> | Map<string, T> | undefined,
): Record<string, T> => {
  if (!value) return {};

  if (isMongooseMap(value)) {
    return Object.fromEntries((value as Map<string, T>).entries());
  }

  return value as Record<string, T>;
};

/**
 * Get a value from a Mongoose Map or plain object by key
 *
 * @param value - The Map or plain object
 * @param key - The key to look up
 * @returns The value at the key, or undefined if not found
 */
export const getMapValue = <T = unknown>(
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
