/**
 * Municipality Search API Contract
 * Endpoint: https://data.geopf.fr/geocodage/search
 *
 * This contract defines the expected request/response format for the
 * municipality search API used in the location search feature.
 */

/**
 * Request Contract
 */
export interface MunicipalitySearchRequest {
  q: string; // Search query (e.g., "Paris")
  type: "municipality"; // Fixed to 'municipality'
  limit?: number; // Optional result limit (default: 10)
}

/**
 * Response Contract
 */
export interface MunicipalitySearchResponse {
  features: MunicipalityFeature[];
}

export interface MunicipalityFeature {
  properties: MunicipalityProperties;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface MunicipalityProperties {
  label: string; // Full label (e.g., "Paris (75), Île-de-France")
  context: string; // Context string (e.g., "75, Île-de-France, France")
  name: string; // City name (e.g., "Paris")
}

/**
 * Example Request
 */
export const MUNICIPALITY_SEARCH_EXAMPLE_REQUEST = {
  q: "Paris",
  type: "municipality" as const,
};

/**
 * Example Response
 */
export const MUNICIPALITY_SEARCH_EXAMPLE_RESPONSE: MunicipalitySearchResponse = {
  features: [
    {
      properties: {
        label: "Paris (75), Île-de-France",
        context: "75, Île-de-France, France",
        name: "Paris",
      },
      geometry: {
        coordinates: [2.3522, 48.8566],
      },
    },
    {
      properties: {
        label: "Paris (60), Hauts-de-France",
        context: "60, Hauts-de-France, France",
        name: "Paris",
      },
      geometry: {
        coordinates: [2.5, 49.5],
      },
    },
  ],
};

/**
 * Validation Rules
 */
export const MUNICIPALITY_VALIDATION_RULES = {
  query: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'àâäçèéêëîïôùûüœæ]+$/i,
    description:
      "Search query with letters, numbers, spaces, hyphens, apostrophes, and French accents",
  },
  response: {
    maxFeatures: 10,
    requiredFields: [
      "properties.label",
      "properties.context",
      "properties.name",
      "geometry.coordinates",
    ],
    description: "Response contains array of features with required properties",
  },
};

/**
 * Error Scenarios
 */
export const MUNICIPALITY_ERROR_SCENARIOS = [
  {
    status: 400,
    message: "Bad Request",
    description: "Invalid query parameter",
  },
  {
    status: 404,
    message: "Not Found",
    description: "No results found for query",
  },
  {
    status: 429,
    message: "Too Many Requests",
    description: "Rate limit exceeded",
  },
  {
    status: 500,
    message: "Internal Server Error",
    description: "API server error",
  },
];

/**
 * Performance SLA
 */
export const MUNICIPALITY_PERFORMANCE_SLA = {
  p50: 100, // milliseconds
  p95: 300, // milliseconds
  p99: 500, // milliseconds
  timeout: 5000, // milliseconds
};
