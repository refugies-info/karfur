/**
 * URL Builder
 *
 * Constructs URLs for production and staging environments.
 */

export const ENVIRONMENTS = {
  prod: "https://refugies.info",
  staging: "https://staging.refugies.info",
} as const;

export type Environment = keyof typeof ENVIRONMENTS;

/**
 * Build a full URL for a given path and environment
 */
export function buildUrl(path: string, env: Environment): string {
  const base = ENVIRONMENTS[env];
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Get the API base URL for fetching content IDs
 */
export function getApiUrl(env: Environment): string {
  return ENVIRONMENTS[env];
}
