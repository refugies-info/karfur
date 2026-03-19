/**
 * Fetch Content IDs from API
 *
 * Fetches dispositif and demarche IDs from the API for visual regression testing.
 * Limits to 5 items per type as specified.
 */

import { ENVIRONMENTS, type Environment } from "./url-builder";

const LIMIT = 5;

interface ApiResponse<T> {
  text: string;
  data: T[];
}

interface SimpleDispositif {
  _id: string;
  typeContenu?: "dispositif" | "demarche";
}

/**
 * Fetch dispositif IDs from API
 */
export async function fetchDispositifIds(env: Environment): Promise<string[]> {
  const baseUrl = ENVIRONMENTS[env];
  const url = `${baseUrl}/dispositifs?type=dispositif&limit=${LIMIT}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch dispositifs: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<SimpleDispositif>;
  return json.data.map((d) => d._id);
}

/**
 * Fetch demarche IDs from API
 */
export async function fetchDemarcheIds(env: Environment): Promise<string[]> {
  const baseUrl = ENVIRONMENTS[env];
  const url = `${baseUrl}/dispositifs?type=demarche&limit=${LIMIT}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch demarches: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<SimpleDispositif>;
  return json.data.map((d) => d._id);
}

/**
 * Fetch all content IDs (dispositifs + demarches)
 */
export async function fetchAllContentIds(
  env: Environment,
): Promise<{ dispositifs: string[]; demarches: string[] }> {
  const [dispositifs, demarches] = await Promise.all([
    fetchDispositifIds(env),
    fetchDemarcheIds(env),
  ]);

  return { dispositifs, demarches };
}
