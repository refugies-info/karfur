import { AgeOptions, FrenchOptions } from "data/searchFilters";
import { GetDispositifsResponse, Id } from "@refugies-info/api-types";

export const filterByThemeOrNeed = (dispositif: GetDispositifsResponse, themesSelected: Id[], needs: Id[], withSecondaryTheme: boolean) => {
  if (themesSelected.length === 0 && needs.length === 0) return true;
  if (dispositif.needs) {
    for (const need of dispositif.needs) { // return true if dispositif has need
      if (needs.includes(need)) return true;
    }
  }
  if (!withSecondaryTheme) { // or has theme as primary one
    if (dispositif.theme && themesSelected.includes(dispositif.theme)) return true;
  } else { // or has theme as secondary one
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


const filterAgeValues = {
  "-18": [0, 18],
  "18-25": [18, 25],
  "+25": [25, 99]
}

export const filterByAge = (dispositif: GetDispositifsResponse, ageFilters: AgeOptions[]) => {
  if (ageFilters.length === 0) return true;
  const audienceAge = dispositif.metadatas.age;
  if (!audienceAge || !audienceAge.ages[0] || !audienceAge.ages[1]) return true;
  for (const age of ageFilters) {
    if (audienceAge.ages[0] <= filterAgeValues[age][0] &&
      audienceAge.ages[1] >= filterAgeValues[age][1]
    ) {
      return true;
    }
  }
  return false;
};

const filterFrenchLevelValues = {
  "a": ["A1", "A2"],
  "b": ["A1", "A2", "B1", "B2"],
  "c": []
}

export const filterByFrenchLevel = (dispositif: GetDispositifsResponse, frenchLevelFilters: FrenchOptions[]) => {
  if (frenchLevelFilters.length === 0) return true;
  const frenchLevels = dispositif.metadatas.frenchLevel;
  if (!frenchLevels || frenchLevels.length === 0) return true;

  if (frenchLevelFilters.includes("c")) {
    return true;
  } else if (frenchLevelFilters.includes("b")) {
    for (const frenchLevel of frenchLevels) {
      if (filterFrenchLevelValues["b"].includes(frenchLevel)) return true;
    }
    return false;
  } else if (frenchLevelFilters.includes("a")) {
    for (const frenchLevel of frenchLevels) {
      if (filterFrenchLevelValues["a"].includes(frenchLevel)) return true;
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

