import { GetDispositifsResponse, Id, publicStatusType, publicType } from "@refugies-info/api-types";
import { AgeOptions, FrenchOptions, TypeOptions } from "data/searchFilters";

export const filterByThemeOrNeed = (
  dispositif: GetDispositifsResponse,
  themesSelected: Id[],
  needs: Id[],
  withSecondaryTheme: boolean,
) => {
  if (themesSelected.length === 0 && needs.length === 0) return true;
  if (dispositif.needs) {
    for (const need of dispositif.needs) {
      // return true if dispositif has need
      if (needs.includes(need)) return true;
    }
  }
  if (!withSecondaryTheme) {
    // or has theme as primary one
    if (dispositif.theme && themesSelected.includes(dispositif.theme)) return true;
  } else {
    // or has theme as secondary one
    if (dispositif.secondaryThemes) {
      for (const theme of dispositif.secondaryThemes) {
        if (themesSelected.includes(theme)) return true;
      }
    }
  }
  return false;
};

export const filterByLocations = (dispositif: GetDispositifsResponse, departments: string[]) => {
  if (departments.length === 0) return true;
  const location = dispositif.metadatas?.location;
  if (!Array.isArray(location)) return true; // not array = france or online -> keep result
  if (!location) return false;
  for (const dep of location) {
    if (departments.includes(dep.split(" - ")[1])) return true;
  }
  return false;
};

const FILTER_AGE_VALUES: Record<AgeOptions, [number, number]> = {
  "-18": [0, 18],
  "18-25": [18, 25],
  "+25": [25, 99],
};

const isAgeRangeCompatible = (filterRange: [number, number], audienceRange: [number, number]): boolean => {
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

export const getMatchingAgeOptions = (dispositif: GetDispositifsResponse): AgeOptions[] => {
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

export const countMatchingAgeOptions = (dispositif: GetDispositifsResponse, ageOptions: AgeOptions[]): number => {
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

export const filterByAge = (dispositif: GetDispositifsResponse, ageFilters: AgeOptions[]) => {
  if (ageFilters.length === 0) return true;
  return countMatchingAgeOptions(dispositif, ageFilters) > 0;
};

const FILTER_FRENCH_LEVEL_VALUES = {
  a: ["A1", "A2"],
  b: ["A1", "A2", "B1", "B2"],
  c: [],
};

export const filterByFrenchLevel = (dispositif: GetDispositifsResponse, frenchLevelFilters: FrenchOptions[]) => {
  if (frenchLevelFilters.length === 0) return true;
  const frenchLevels = dispositif.metadatas?.frenchLevel;
  if (!frenchLevels || frenchLevels.length === 0) return true;

  if (frenchLevelFilters.includes("c")) {
    return true;
  } else if (frenchLevelFilters.includes("b")) {
    for (const frenchLevel of frenchLevels) {
      if (FILTER_FRENCH_LEVEL_VALUES["b"].includes(frenchLevel)) return true;
    }
    return false;
  } else if (frenchLevelFilters.includes("a")) {
    for (const frenchLevel of frenchLevels) {
      if (FILTER_FRENCH_LEVEL_VALUES["a"].includes(frenchLevel)) return true;
    }
    return false;
  }

  return false;
};

export const filterByLanguage = (dispositif: GetDispositifsResponse, languageFilters: string[]) => {
  if (languageFilters.length === 0) return true;
  for (const ln of languageFilters) {
    if (dispositif.availableLanguages.includes(ln)) {
      return true;
    }
  }
  return false;
};

export const filterByPublic = (dispositif: GetDispositifsResponse, publicFilters: publicType[]) => {
  if (publicFilters.length === 0) return true;
  for (const value of publicFilters) {
    if (dispositif.metadatas?.public?.includes(value)) {
      return true;
    }
  }
  return false;
};

export const filterByStatus = (dispositif: GetDispositifsResponse, statusFilters: publicStatusType[]) => {
  if (statusFilters.length === 0) return true;
  for (const value of statusFilters) {
    if (dispositif.metadatas?.publicStatus?.includes(value)) {
      return true;
    }
  }
  return false;
};

export const filterByType = ({ typeContenu, metadatas }: GetDispositifsResponse, type: TypeOptions) => {
  switch (type) {
    case "all":
      return true;
    case "demarche":
      return typeContenu === "demarche";
    case "dispositif":
      return typeContenu === "dispositif";
    case "ressource":
      return metadatas?.location === "online";
  }
};
