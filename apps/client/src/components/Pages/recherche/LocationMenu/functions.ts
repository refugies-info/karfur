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
 * Fetches the department for a given city using the geo API
 */
export const getDepartmentForCity = async (cityName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(cityName)}&type=municipality`,
    );
    const data = await response.json();

    if (data?.features?.[0]?.properties?.context) {
      // Extract department code from the context (usually in format "XX, Region")
      const context = data.features[0].properties.context;
      const departmentCode = context.split(",")[0].trim();

      // Get department name from the code
      const deptResponse = await fetch(`https://geo.api.gouv.fr/departements/${departmentCode}`);
      const deptData = await deptResponse.json();

      return deptData?.nom ? deptData.nom : null;
    }
    return null;
  } catch (error) {
    // Log error in production
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Error fetching department for city:", error);
    }
    return null;
  }
};

/**
 * Get all cities for a given department (preserving original case)
 * @param departmentName The department name (can be in any case)
 * @returns Array of city names in their original case
 */
export const getCitiesForDepartment = async (departmentName: string): Promise<string[]> => {
  try {
    // First, get the department code from the name
    const deptResponse = await fetch(
      `https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(departmentName)}`,
    );
    const deptData = await deptResponse.json();

    if (!deptData || deptData.length === 0) return [];

    const departmentCode = deptData[0].code;

    // Then get all cities for that department
    const citiesResponse = await fetch(
      `https://geo.api.gouv.fr/departements/${departmentCode}/communes`,
    );
    const citiesData = await citiesResponse.json();

    return citiesData.map((city: any) => city.nom);
  } catch (error) {
    return [];
  }
};

/**
 * Sort results by relevance
 */
export function sortByRelevance(
  results: UnifiedSearchResult[],
  query: string,
): UnifiedSearchResult[] {
  const queryLower = query.toLowerCase();

  const getScore = (result: UnifiedSearchResult): number => {
    const name = result.displayName.toLowerCase();

    if (result.type === "department" && name === queryLower) return 8; // Correspondance exacte département
    if (result.type === "city" && name === queryLower) return 7; // Correspondance exacte ville
    if (result.type === "department" && name.startsWith(queryLower)) return 6; // Le département commence par
    if (result.type === "city" && name.startsWith(queryLower)) return 5; // La ville commence par
    if (result.type === "department" && name.includes(queryLower)) return 4; // Le département contient
    if (result.type === "city" && name.includes(queryLower)) return 3; // La ville contient
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
