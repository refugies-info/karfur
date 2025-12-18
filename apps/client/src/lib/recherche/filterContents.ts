import type { Id, publicStatusType, publicType, SimpleDispositif } from "@refugies-info/api-types";
import type { AgeOptions, FrenchOptions, TypeOptions } from "data/searchFilters";

export const filterByThemeOrNeed = (
  dispositif: SimpleDispositif,
  themesSelected: Id[],
  needs: Id[],
  withSecondaryTheme: boolean,
  inferedThemes?: Id[],
) => {
  if (themesSelected.length === 0 && needs.length === 0) return true;

  // Normalize all IDs to strings for consistent comparison
  const dispositifThemeStr = String(dispositif.theme || "");
  const inferedThemesStr = inferedThemes?.map(String) || [];
  const needsStr = needs.map(String);
  const themesSelectedStr = themesSelected.map(String);

  // Only apply inferred themes filtering when themes are explicitly selected
  // When themesSelected is empty, inferred themes should not filter out dispositifs
  if (
    themesSelected.length > 0 &&
    inferedThemesStr.length > 0 &&
    dispositifThemeStr &&
    !inferedThemesStr.includes(dispositifThemeStr)
  ) {
    return false;
  }

  // If we have needs to filter by, check if dispositif has any of them
  if (needs.length > 0) {
    if (dispositif.needs) {
      for (const need of dispositif.needs) {
        const needStr = String(need);
        if (needsStr.includes(needStr)) return true;
      }
    }
    // If we only have needs (no themes), and no needs match, return false
    if (themesSelected.length === 0) return false;
  }

  // If we have themes to filter by
  if (themesSelected.length > 0) {
    if (!withSecondaryTheme) {
      // check primary theme
      if (dispositifThemeStr && themesSelectedStr.includes(dispositifThemeStr)) return true;
    } else {
      // check secondary themes
      if (dispositif.secondaryThemes) {
        for (const theme of dispositif.secondaryThemes) {
          const themeStr = String(theme);
          if (themesSelectedStr.includes(themeStr)) return true;
        }
      }
    }
  }

  return false;
};

export const filterByLocations = (dispositif: SimpleDispositif, departments: string[]) => {
  if (departments.length === 0) return true;
  const location = dispositif.metadatas?.location as any;
  if (!location) return false;
  const matchDep = (val: string) => {
    if (!val) return false;
    // Fiches "toute la france" should always appear when filtering by department
    if (val === "france") return true;
    const parts = val.split(" - ");
    const code = parts.length > 1 ? parts[1] : val;
    return departments.includes(code);
  };
  if (Array.isArray(location)) {
    for (const dep of location) {
      if (matchDep(dep)) return true;
    }
    return false;
  }
  // string value
  return matchDep(location);
};

const FILTER_AGE_VALUES: Record<AgeOptions, [number, number]> = {
  "-18": [0, 18],
  "18-25": [18, 25],
  "+25": [25, 99],
};

const isAgeRangeCompatible = (
  filterRange: [number, number],
  audienceRange: [number, number],
): boolean => {
  const [filterMin, filterMax] = filterRange;
  const [audienceMin, audienceMax] = audienceRange;

  return filterMin >= audienceMin && filterMax <= audienceMax;
};

interface AudienceAge {
  type: "between" | "moreThan" | "lessThan";
  ages: number[];
}

function convertAudienceAgeToRange(audienceAge: AudienceAge): [number, number] {
  const MAX_AGE = Number.MAX_SAFE_INTEGER;
  const MIN_AGE = 0;

  switch (audienceAge.type) {
    case "between":
      if (audienceAge.ages.length !== 2) {
        throw new Error("Invalid 'between' age range");
      }
      return [audienceAge.ages[0], audienceAge.ages[1]];

    case "moreThan":
      if (audienceAge.ages.length !== 1) {
        throw new Error("Invalid 'moreThan' age value");
      }
      return [audienceAge.ages[0] + 1, MAX_AGE];

    case "lessThan":
      if (audienceAge.ages.length !== 1) {
        throw new Error("Invalid 'lessThan' age value");
      }
      return [MIN_AGE, audienceAge.ages[0] - 1];

    default:
      throw new Error("Invalid audience age type");
  }
}

export const getMatchingAgeOptions = (dispositif: SimpleDispositif): AgeOptions[] => {
  const allAgeOptions = Object.keys(FILTER_AGE_VALUES) as AgeOptions[];
  const audienceAge = dispositif.metadatas?.age;
  if (!audienceAge || !audienceAge.ages) return allAgeOptions;

  const audienceAgeRange = convertAudienceAgeToRange(audienceAge);

  return allAgeOptions.reduce((acc, age) => {
    const filterRange = FILTER_AGE_VALUES[age];
    if (isAgeRangeCompatible(filterRange, audienceAgeRange)) {
      return [...acc, age];
    }
    return acc;
  }, [] as AgeOptions[]);
};

export const countMatchingAgeOptions = (
  dispositif: SimpleDispositif,
  ageOptions: AgeOptions[],
): number => {
  const audienceAge = dispositif.metadatas?.age;
  if (!audienceAge || !audienceAge.ages) return ageOptions.length;

  const audienceAgeRange = convertAudienceAgeToRange(audienceAge);

  return ageOptions.reduce((count, age) => {
    const filterRange = FILTER_AGE_VALUES[age];
    if (isAgeRangeCompatible(filterRange, audienceAgeRange)) {
      return count + 1;
    }
    return count;
  }, 0);
};

export const filterByAge = (dispositif: SimpleDispositif, ageFilters: AgeOptions[]) => {
  if (ageFilters.length === 0) return true;
  return countMatchingAgeOptions(dispositif, ageFilters) > 0;
};

const FILTER_FRENCH_LEVEL_VALUES: Record<FrenchOptions, string[]> = {
  a: ["alpha", "A1", "A2"],
  b: ["B1", "B2"],
  c: ["C1", "C2"],
};

export const filterByFrenchLevel = (
  dispositif: SimpleDispositif,
  frenchLevelFilters: FrenchOptions[],
) => {
  if (frenchLevelFilters.length === 0) return true;
  const frenchLevels = dispositif.metadatas?.frenchLevel as string[] | undefined;
  // If no level specified on the record, consider it matching all (as per UI counts logic)
  if (!frenchLevels || frenchLevels.length === 0) return true;

  // Build the union of allowed concrete levels from selected categories
  const allowed = new Set<string>();
  for (const cat of frenchLevelFilters) {
    for (const lvl of FILTER_FRENCH_LEVEL_VALUES[cat]) allowed.add(lvl);
  }

  return frenchLevels.some((lvl) => allowed.has(lvl));
};

export const filterByLanguage = (dispositif: SimpleDispositif, languageFilters: string[]) => {
  if (languageFilters.length === 0) return true;
  for (const ln of languageFilters) {
    if (dispositif.availableLanguages.includes(ln)) {
      return true;
    }
  }
  return false;
};

export const filterByPublic = (dispositif: SimpleDispositif, publicFilters: publicType[]) => {
  if (publicFilters.length === 0) return true;
  for (const value of publicFilters) {
    if (dispositif.metadatas?.public?.includes(value)) {
      return true;
    }
  }
  return false;
};

export const filterByStatus = (dispositif: SimpleDispositif, statusFilters: publicStatusType[]) => {
  if (statusFilters.length === 0) return true;
  for (const value of statusFilters) {
    if (dispositif.metadatas?.publicStatus?.includes(value)) {
      return true;
    }
  }
  return false;
};

export const filterByType = ({ typeContenu, metadatas }: SimpleDispositif, type: TypeOptions) => {
  switch (type) {
    case "all":
      return true;
    case "demarche":
      return typeContenu === "demarche";
    case "dispositif":
      // Exclude online resources from dispositif tab
      return typeContenu === "dispositif" && metadatas?.location !== "online";
    case "ressource":
      return metadatas?.location === "online";
  }
};

export const filterByOrigin = (dispositif: SimpleDispositif, originFilters: ("RI" | "RCO")[]) => {
  if (originFilters.length === 0) return true;
  return originFilters.includes(dispositif.origin);
};
