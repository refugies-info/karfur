import { SearchDispositif } from "types/interface";
import { Results, SearchQuery } from "pages/recherche";
import { getDispositifInfos } from "../getDispositifInfos";
import {
  filterByThemeOrNeed,
  filterByLocations,
  filterByAge,
  filterByFrenchLevel,
  filterByLanguage,
} from "./filterContents";
import { sortDispositifs } from "./sortContents";
import algoliasearch from "algoliasearch";
import { getSearchableAttributes, Hit } from "./getAlgoliaSearchableAttributes";

const searchClient = algoliasearch("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const indexName = (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") ?
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD :
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG;
const index = searchClient.initIndex(indexName || "");

/**
 * Return the number of dispositifs for a department
 * @param department - string
 * @param dispositifs - list of dispositifs
 * @returns number
 */
export const getCountDispositifsForDepartment = (
  department: string,
  dispositifs: SearchDispositif[],
): number => {
  return [...dispositifs]
    .filter(dispositif => {
      const location = getDispositifInfos(dispositif, "location");
      if (!location?.departments) return false;
      return location.departments.map(dep => dep.split(" - ")[1]).includes(department)
    }).length
}

/**
 * Filters a list of dispositifs from a query, for primary theme or secondary themes
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param secondaryThemes - boolean. Use the primary or secondary theme to filter.
 * @returns - list of dispositifs
 */
const filterDispositifs = (
  query: SearchQuery,
  dispositifs: SearchDispositif[],
  secondaryThemes: boolean
): SearchDispositif[] => {
  return [...dispositifs]
    .filter(dispositif => filterByThemeOrNeed(dispositif, query.themesSelected, query.needsSelected, secondaryThemes))
    .filter(dispositif => filterByLocations(dispositif, query.departmentsSelected))
    .filter(dispositif => filterByAge(dispositif, query.filterAge))
    .filter(dispositif => filterByFrenchLevel(dispositif, query.filterFrenchLevel))
    .filter(dispositif => filterByLanguage(dispositif, query.filterLanguage))
    .sort((a, b) => sortDispositifs(a, b, query.selectedSort, !!query.search));
}

/**
 * Use the query to filter a list of dispositifs
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @returns - results
 */
export const queryDispositifs = (
  query: SearchQuery,
  dispositifs: SearchDispositif[],
): Results => {
  const results = filterDispositifs(query, dispositifs, false);

  // dispositifs which have theme in secondary themes
  let dispositifsSecondaryTheme: SearchDispositif[] = [];
  if (query.themesSelected.length > 0) {
    const remainingDispositifs = [...dispositifs] // remove dispositifs already selected
      .filter(dispositif => !results.map(d => d._id).includes(dispositif._id));
    dispositifsSecondaryTheme = filterDispositifs(query, remainingDispositifs, true);
  }

  return {
    dispositifs: results.filter(d => d.typeContenu === "dispositif"),
    demarches: results.filter(d => d.typeContenu === "demarche"),
    dispositifsSecondaryTheme: dispositifsSecondaryTheme,
  }
}

/**
 * Use Algolia and the query to filter a list of dispositifs
 * @async
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param locale - language to use for Algolia
 * @returns - results
 */
export const queryDispositifsWithAlgolia = async (
  query: SearchQuery,
  dispositifs: SearchDispositif[],
  locale: string
): Promise<Results> => {

  let filteredDispositifsByAlgolia: SearchDispositif[] = [...dispositifs];
  if (query.search) { /* TODO : do not relaunch search if not changed */
    let hits: Hit[] = [];
    hits = await index
      .search(query.search, {
        restrictSearchableAttributes: getSearchableAttributes(locale)
      })
      .then(({ hits }) => hits.map(h => ({ id: h.objectID, highlight: h._highlightResult })));

    filteredDispositifsByAlgolia = hits.map(hit => {
      const dispositif = dispositifs.find(d => d._id.toString() === hit.id);
      // deep clone object to make sure cards components re-renders
      const newDispositif: SearchDispositif | undefined = dispositif ? JSON.parse(JSON.stringify(dispositif)) : undefined;
      if (newDispositif) {
        newDispositif.abstract = hit.highlight[`abstract_${locale}`]?.value || newDispositif.abstract;
        newDispositif.titreInformatif = hit.highlight[`title_${locale}`]?.value || newDispositif.titreInformatif;
        newDispositif.titreMarque = hit.highlight[`titreMarque_${locale}`]?.value || newDispositif.titreMarque;
        // newDispositif.mainSponsor.nom = hit.highlight.sponsorName.value;
      }
      return newDispositif;
    }).filter(d => !!d) as SearchDispositif[];
  }
  return queryDispositifs(query, filteredDispositifsByAlgolia);
};
