export const getPlaceName = (feature: any): string => {
  const { properties } = feature;
  const placeName = properties.name;
  if (placeName) {
    if (properties.type === "municipality") {
      return `${placeName} (ville)`;
    }
    if (properties.type === "administrativearea") {
      return `${placeName} (département)`;
    }
  }
  return properties.label;
};

// API Response Interfaces
export interface MunicipalityApiResponse {
  features: MunicipalityFeature[];
}

export interface MunicipalityFeature {
  properties: {
    label: string;
    context: string;
    name: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

export interface DepartmentApiResponse {
  code: string;
  nom: string;
  codeRegion: string;
  region: string;
}

// Unified Search Result Interface
export interface UnifiedSearchResult {
  /**
   * Display information
   */
  label: string; // e.g., "Paris (75)" or "Rhône (dept)"
  displayName: string; // e.g., "Paris" or "Rhône"

  /**
   * Department information (always present)
   */
  deptCode: string; // e.g., "75", "69" (used for final filter)
  deptName: string; // e.g., "Île-de-France", "Rhône"

  /**
   * Source information
   */
  type: "city" | "department"; // Distinguishes result type
  source: "municipality" | "department"; // API source

  /**
   * Selection state
   */
  isSelected: boolean; // Tracks if this location is selected

  /**
   * Optional metadata
   */
  postalCode?: string; // e.g., "75001" (only for cities)
  region?: string; // e.g., "Île-de-France" (from department API)
}

/**
 * Transform municipality API response to UnifiedSearchResult
 */
export function transformMunicipalityResult(feature: MunicipalityFeature): UnifiedSearchResult {
  const contextParts = feature.properties.context.split(", ");
  const postalCode = contextParts[0];
  const deptName = contextParts[1];

  return {
    label: `${feature.properties.name} (${postalCode})`,
    displayName: feature.properties.name,
    deptCode: postalCode.substring(0, 2),
    deptName: deptName,
    type: "city",
    source: "municipality",
    postalCode: postalCode,
    region: contextParts[2] || undefined,
    isSelected: false,
  };
}

/**
 * Transform department API response to UnifiedSearchResult
 */
export function transformDepartmentResult(dept: DepartmentApiResponse): UnifiedSearchResult {
  return {
    label: `${dept.nom} (dept)`,
    displayName: dept.nom,
    deptCode: dept.code,
    deptName: dept.nom,
    type: "department",
    source: "department",
    region: dept.region,
    isSelected: false,
  };
}

/**
 * Normalize string for comparison (remove accents, normalize spaces/hyphens, and lowercase)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s-]+/g, " ") // Normalize multiple spaces/hyphens to single space
    .trim(); // Remove leading/trailing spaces
}

/**
 * Sort results by relevance
 */

export function sortByRelevance(results: UnifiedSearchResult[], query: string): UnifiedSearchResult[] {
  const queryNormalized = normalizeString(query);
  const queryLower = query.toLowerCase();

  const getScore = (result: UnifiedSearchResult): number => {
    const name = result.displayName.toLowerCase();
    const nameNormalized = normalizeString(result.displayName);

    if (result.type === "department" && (name === queryLower || nameNormalized === queryNormalized)) return 8; // Correspondance exacte département
    if (result.type === "city" && (name === queryLower || nameNormalized === queryNormalized)) return 7; // Correspondance exacte ville
    if (result.type === "department" && (name.startsWith(queryLower) || nameNormalized.startsWith(queryNormalized)))
      return 6; // Le département commence par
    if (result.type === "city" && (name.startsWith(queryLower) || nameNormalized.startsWith(queryNormalized))) return 5; // La ville commence par
    if (result.type === "department" && (name.includes(queryLower) || nameNormalized.includes(queryNormalized)))
      return 4; // Le département contient
    if (result.type === "city" && (name.includes(queryLower) || nameNormalized.includes(queryNormalized))) return 3; // La ville contient
    return 0;
  };

  return results.sort((a, b) => {
    const scoreA = getScore(a);
    const scoreB = getScore(b);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Score plus élevé en premier
    }

    // Priorité 7: Les départements avec un nom plus court ont la priorité
    if (a.type === "department" && b.type === "department") {
      if (a.displayName.length !== b.displayName.length) {
        return a.displayName.length - b.displayName.length;
      }
    }

    // Priorité 8: Ordre alphabétique pour départager
    return a.displayName.localeCompare(b.displayName);
  });
}
