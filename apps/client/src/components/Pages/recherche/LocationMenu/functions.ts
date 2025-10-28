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
  // Display information
  label: string;
  displayName: string;

  // Department information (always present)
  deptCode: string;
  deptName: string;

  // Source information
  type: "city" | "department";
  source: "municipality" | "department";

  // Optional metadata
  postalCode?: string;
  region?: string;
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
  };
}

/**
 * Sort results by relevance
 */
/**
 * Normalize string for comparison (remove accents, normalize spaces/hyphens, and lowercase)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s-]+/g, " ") // Normalize multiple spaces/hyphens to single space
    .trim(); // Remove leading/trailing spaces
}

export function sortByRelevance(results: UnifiedSearchResult[], query: string): UnifiedSearchResult[] {
  return results.sort((a, b) => {
    const queryNormalized = normalizeString(query);
    const queryLower = query.toLowerCase();
    const aName = a.displayName.toLowerCase();
    const bName = b.displayName.toLowerCase();
    const aNameNormalized = normalizeString(a.displayName);
    const bNameNormalized = normalizeString(b.displayName);

    // Priority 1: Exact department match (highest priority) - try both exact and normalized
    const aDeptExact = a.type === "department" && (aName === queryLower || aNameNormalized === queryNormalized);
    const bDeptExact = b.type === "department" && (bName === queryLower || bNameNormalized === queryNormalized);
    if (aDeptExact && !bDeptExact) return -1;
    if (!aDeptExact && bDeptExact) return 1;

    // Priority 2: Exact city match (lower than department exact)
    const aCityExact = a.type === "city" && (aName === queryLower || aNameNormalized === queryNormalized);
    const bCityExact = b.type === "city" && (bName === queryLower || bNameNormalized === queryNormalized);
    if (aCityExact && !bCityExact) return -1;
    if (!aCityExact && bCityExact) return 1;

    // Priority 3: Department starts with query (high priority) - try both original and normalized
    const aDeptStarts =
      a.type === "department" && (aName.startsWith(queryLower) || aNameNormalized.startsWith(queryNormalized));
    const bDeptStarts =
      b.type === "department" && (bName.startsWith(queryLower) || bNameNormalized.startsWith(queryNormalized));
    if (aDeptStarts && !bDeptStarts) return -1;
    if (!aDeptStarts && bDeptStarts) return 1;

    // Priority 4: City starts with query
    const aCityStarts =
      a.type === "city" && (aName.startsWith(queryLower) || aNameNormalized.startsWith(queryNormalized));
    const bCityStarts =
      b.type === "city" && (bName.startsWith(queryLower) || bNameNormalized.startsWith(queryNormalized));
    if (aCityStarts && !bCityStarts) return -1;
    if (!aCityStarts && bCityStarts) return 1;

    // Priority 5: Department contains query (still higher priority than city contains)
    const aDeptContains =
      a.type === "department" && (aName.includes(queryLower) || aNameNormalized.includes(queryNormalized));
    const bDeptContains =
      b.type === "department" && (bName.includes(queryLower) || bNameNormalized.includes(queryNormalized));
    if (aDeptContains && !bDeptContains && b.type === "city") return -1;
    if (!aDeptContains && bDeptContains && a.type === "city") return 1;

    // Priority 6: City contains query
    const aCityContains =
      a.type === "city" && (aName.includes(queryLower) || aNameNormalized.includes(queryNormalized));
    const bCityContains =
      b.type === "city" && (bName.includes(queryLower) || bNameNormalized.includes(queryNormalized));
    if (aCityContains && !bCityContains) return -1;
    if (!aCityContains && bCityContains) return 1;

    // Priority 7: Department with shorter name gets priority (Rhône before Bouches-du-Rhône)
    if (a.type === "department" && b.type === "department") {
      return a.displayName.length - b.displayName.length;
    }

    // Priority 8: Alphabetical as final tiebreaker
    return a.displayName.localeCompare(b.displayName);
  });
}
