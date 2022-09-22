import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { IDispositif } from "types/interface";
import { Results, SearchQuery, UrlSearchQuery } from "pages/recherche";
import { ObjectId } from "mongodb";
import { getDispositifInfos } from "./getDispositifInfos";
import algoliasearch from "algoliasearch";
import { logger } from "logger";

const searchClient = algoliasearch("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const index = searchClient.initIndex(process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX || "");

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

export const queryDispositifs = (
  query: SearchQuery,
  dispositifs: IDispositif[],
) => {
  return [...dispositifs]
    .filter(dispositif => filterByNeed(dispositif, query.needsSelected))
    .filter(dispositif => filterByLocation(dispositif, query.departmentsSelected))
    .filter(dispositif => filterByAge(dispositif, query.filterAge))
    .filter(dispositif => filterByFrenchLevel(dispositif, query.filterFrenchLevel))
    .filter(dispositif => filterByLanguage(dispositif, query.filterLanguage))
    .sort((a, b) => sortDispositifs(a, b, query.selectedSort));
}


// ALGOLIA
const commonSearchableAttributes = [
  "sponsorName"
];

const localizedSearchableAttributes = [
  "title",
  "name",
  "titreMarque",
  "abstract"
];

const getSearchableAttributes = (selectedLanguage: string | null) => {
  const localizedAttributes: string[] = []

  for (const attr of localizedSearchableAttributes) {
    localizedAttributes.push(`${attr}_fr`);
    if (selectedLanguage && selectedLanguage !== "fr") localizedAttributes.push(`${attr}_${selectedLanguage}`);
  }

  return [
    ...localizedAttributes,
    ...commonSearchableAttributes,
  ]
};

type Hit = { id: string, highlight: any };

export const queryDispositifsWithAlgolia = async (
  query: SearchQuery,
  dispositifs: IDispositif[],
  locale: string
): Promise<Results> => {

  let filteredDispositifsByAlgolia: IDispositif[] = [...dispositifs];
  if (query.search) { // TODO: do not relaunch if oldSearch
    let hits: Hit[] = [];
    hits = await index
      .search(query.search, {
        restrictSearchableAttributes: getSearchableAttributes(locale)
      })
      .then(({ hits }) => hits.map(h => ({ id: h.objectID, highlight: h._highlightResult })));

    filteredDispositifsByAlgolia = hits.map(hit => {
      const dispositif = dispositifs.find(d => d._id.toString() === hit.id);
      if (dispositif) {
        dispositif.abstract = hit.highlight[`abstract_${locale}`]?.value || dispositif.abstract;
        dispositif.titreInformatif = hit.highlight[`title_${locale}`]?.value || dispositif.titreInformatif;
        dispositif.titreMarque = hit.highlight[`titreMarque_${locale}`]?.value || dispositif.titreMarque;
        // dispositif.mainSponsor.nom = hit.highlight.sponsorName.value;
      }
      return dispositif;
    }).filter(d => !!d) as IDispositif[];
  }

  const filteredDispositifs = queryDispositifs(query, filteredDispositifsByAlgolia);

  return {
    dispositifs: filteredDispositifs.filter(d => d.typeContenu === "dispositif"),
    demarches: filteredDispositifs.filter(d => d.typeContenu === "demarche")
  }
};


export const decodeQuery = (routerQuery: any): SearchQuery => {
  const {
    departments, needs, ages, frenchLevels, language, sort, type
  } = routerQuery as UrlSearchQuery;

  let query: SearchQuery = {
    search: "",
    departmentsSelected: [],
    needsSelected: [],
    filterAge: [],
    filterFrenchLevel: [],
    filterLanguage: [],
    selectedSort: "date",
    selectedType: "all",
  }

  // Reinject filters value in search
  if (departments || needs || ages || frenchLevels || language || sort || type) {
    if (departments) query.departmentsSelected = decodeURIComponent(departments as string).split(",");
    if (needs) query.needsSelected = decodeURIComponent(needs as string).split(",") as unknown as ObjectId[];
    if (ages) query.filterAge = decodeURIComponent(ages as string).split(",") as AgeOptions[];
    if (frenchLevels) query.filterFrenchLevel = decodeURIComponent(frenchLevels as string).split(",") as FrenchOptions[];
    if (language) query.filterLanguage = decodeURIComponent(language as string).split(",");
    if (sort) query.selectedSort = decodeURIComponent(sort as string) as SortOptions;
    if (type) query.selectedType = decodeURIComponent(type as string) as TypeOptions;
  }

  return query;
}
