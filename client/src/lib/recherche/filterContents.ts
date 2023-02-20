import { AgeOptions, FrenchOptions } from "data/searchFilters";
import { GetDispositifsResponse, Id } from "api-types";

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
  const location = dispositif.metadatas.location;
  if (!location) return false;
  for (const dep of location) {
    if (departments.includes(dep.split(" - ")[1]) || dep === "All") {
      return true;
    }
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
  const audienceAge = dispositif.audienceAge[0];
  if (!audienceAge.bottomValue || !audienceAge.topValue) return true;
  for (const age of ageFilters) {
    if (audienceAge.bottomValue <= filterAgeValues[age][0] &&
      audienceAge.topValue >= filterAgeValues[age][1]
    ) {
      return true;
    }
  }
  return false;
};

const filterFrenchLevelValues = {
  "a": ["Débutant"],
  "b": ["Débutant", "Intermédiaire"],
  "c": []
}

export const filterByFrenchLevel = (dispositif: GetDispositifsResponse, frenchLevelFilters: FrenchOptions[]) => {
  if (frenchLevelFilters.length === 0) return true;
  const frenchLevels = dispositif.niveauFrancais;
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
    if (dispositif.avancement?.[ln]) {
      return true;
    }
  }
  return false;
};

