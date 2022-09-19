import { AgeOptions, FrenchOptions, SortOptions } from "data/searchFilters";
import { IDispositif } from "types/interface";
import { SearchQuery } from "pages/recherche";
import { ObjectId } from "mongodb";
import { getDispositifInfos } from "./getDispositifInfos";


const filterByNeed = (dispositif: IDispositif, needsSelected: ObjectId[]) => {
  if (needsSelected.length === 0) return true;
  for (const need of dispositif.needs) {
    if (needsSelected.includes(need)) return true;
  }
  return false;
};

const filterByLocation = (dispositif: IDispositif, departmentsSelected: string[]) => {
  if (departmentsSelected.length === 0) return true;
  const location = getDispositifInfos(dispositif, "location");
  if (!location?.departments) return false;
  for (const dep of location?.departments) {
    if (departmentsSelected.includes(dep.split(" - ")[1])) return true;
  }
  return false;
};


const filterAgeValues = {
  "-18": [0, 18],
  "18-25": [18, 25],
  "+25": [25, 99]
}

const filterByAge = (dispositif: IDispositif, ageFilters: AgeOptions[]) => {
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
// TODO: improve, check old function
const filterByFrenchLevel = (dispositif: IDispositif, frenchLevelFilters: FrenchOptions[]) => {
  if (frenchLevelFilters.length === 0) return true;
  const frenchLevels = dispositif.niveauFrancais;
  if (!frenchLevels) return true;

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

const filterByLanguage = (dispositif: IDispositif, languageFilters: string[]) => {
  if (languageFilters.length === 0) return true;
  for (const ln of languageFilters) {
    if (dispositif.avancement?.[ln]) {
      return true;
    }
  }
  return false;
};

const sortOptionsValues = {
  "date": "created_at",
  "view": "nbVues",
  "theme": "theme"
}

const sortDispositifs = (dispA: IDispositif, dispB: IDispositif, sortOption: SortOptions) => {
  const sortKey = sortOptionsValues[sortOption];
  //@ts-ignore
  return dispA[sortKey] > dispB[sortKey] ? -1 : dispA[sortKey] < dispB[sortKey] ? 1 : 0;
}

export interface SearchResult {
  dispositifs: IDispositif[]
  demarches: IDispositif[]
}

export const queryDispositifs = (
  query: SearchQuery,
  dispositifs: IDispositif[],
): SearchResult => {
  let filteredDispositifs = [...dispositifs]
    .filter(dispositif => filterByNeed(dispositif, query.needsSelected))
    .filter(dispositif => filterByLocation(dispositif, query.departmentsSelected))
    .filter(dispositif => filterByAge(dispositif, query.filterAge))
    .filter(dispositif => filterByFrenchLevel(dispositif, query.filterFrenchLevel))
    .filter(dispositif => filterByLanguage(dispositif, query.filterLanguage))
    .sort((a, b) => sortDispositifs(a, b, query.selectedSort));

  return {
    dispositifs: filteredDispositifs.filter(d => d.typeContenu === "dispositif"),
    demarches: filteredDispositifs.filter(d => d.typeContenu === "demarche")
  }
};


interface QueryState {
  searchToggleVisible: boolean
  geoSearch: boolean
  query: any
}
export const decodeQuery = (routerQuery: any): QueryState => {
  const {
    tag, dep, city, age, niveauFrancais, filter, langue, tri
  } = routerQuery;
  let searchToggleVisible = false;
  let geoSearch = false;
  let query: any = { order: "" }

  if (filter || langue || tri) searchToggleVisible = true;

  // Reinject filters value in search
  if (tag || age || niveauFrancais || dep || city || filter || langue || tri) {
    if (tag) query.theme = decodeURIComponent(tag).split(",");
    if (age) query.age = decodeURIComponent(age);
    if (dep && city) {
      query.loc = {
        city: decodeURIComponent(city),
        dep: decodeURIComponent(dep)
      }
      geoSearch = true;
    }
    if (niveauFrancais) query.frenchLevel = decodeURIComponent(niveauFrancais);
    if (filter) query.type = decodeURIComponent(filter) as ("dispositifs" | "demarches" | undefined);
    if (langue) query.langue = langue
    if (tri) query.order = tri
  }

  return {
    searchToggleVisible,
    geoSearch,
    query,
  }
}
