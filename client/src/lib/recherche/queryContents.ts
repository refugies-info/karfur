import algoliasearch from "algoliasearch";
import { SearchDispositif } from "types/interface";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { Results } from "services/SearchResults/searchResults.reducer";
import {
  filterByThemeOrNeed,
  filterByLocations,
  filterByAge,
  filterByFrenchLevel,
  filterByLanguage,
} from "./filterContents";
import { sortDispositifs } from "./sortContents";
import { getSearchableAttributes, Hit } from "./getAlgoliaSearchableAttributes";

const searchClient = algoliasearch("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const indexName = (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") ?
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD :
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG;
const index = searchClient.initIndex(indexName || "");


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
    .filter(dispositif => filterByThemeOrNeed(dispositif, query.themes, query.needs, secondaryThemes))
    .filter(dispositif => filterByLocations(dispositif, query.departments))
    .filter(dispositif => filterByAge(dispositif, query.age))
    .filter(dispositif => filterByFrenchLevel(dispositif, query.frenchLevel))
    .filter(dispositif => filterByLanguage(dispositif, query.language))
    .sort((a, b) => sortDispositifs(a, b, query.sort, !!query.search));
}

let searchCache = "";
let searchCacheResults: SearchDispositif[] = [];
const queryOnAlgolia = async (
  search: string,
  dispositifs: SearchDispositif[],
  locale: string
) => {
  let filteredDispositifsByAlgolia: SearchDispositif[] = [...dispositifs];
  if (search) {
    if (search !== searchCache) { // new search
      searchCache = search; // keep search in cache to prevent useless algolia searchs
      let hits: Hit[] = [];
      hits = await index
        .search(search, {
          restrictSearchableAttributes: getSearchableAttributes(locale),
          hitsPerPage: 600
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
      searchCacheResults = filteredDispositifsByAlgolia;
    } else { // same search
      filteredDispositifsByAlgolia = [...searchCacheResults];
    }
  }
  return filteredDispositifsByAlgolia;
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
  let demarchesSecondaryTheme: SearchDispositif[] = [];
  if (query.themes.length > 0) {
    const remainingDispositifs = [...dispositifs] // remove dispositifs already selected
      .filter(dispositif => !results.map(d => d._id).includes(dispositif._id));
    const contentSecondaryTheme = filterDispositifs(query, remainingDispositifs, true);
    dispositifsSecondaryTheme = contentSecondaryTheme.filter(d => d.typeContenu === "dispositif");
    demarchesSecondaryTheme = contentSecondaryTheme.filter(d => d.typeContenu === "demarche");
  }

  return {
    dispositifs: results.filter(d => d.typeContenu === "dispositif"),
    demarches: [...results.filter(d => d.typeContenu === "demarche"), ...demarchesSecondaryTheme],
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
  const filteredDispositifsByAlgolia = await queryOnAlgolia(query.search, dispositifs, locale);
  return queryDispositifs(query, filteredDispositifsByAlgolia);
};

/**
 * Query the dispositifs with all filters except themes or needs. Useful for the theme dropdown popup.
 * @async
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param locale - language to use for Algolia
 * @returns - results
 */
export const queryDispositifsWithoutThemes = async (
  query: SearchQuery,
  dispositifs: SearchDispositif[],
  locale: string
): Promise<SearchDispositif[]> => {
  const filteredDispositifsByAlgolia = await queryOnAlgolia(query.search, dispositifs, locale);
  return [...filteredDispositifsByAlgolia]
    .filter(dispositif => filterByLocations(dispositif, query.departments))
    .filter(dispositif => filterByAge(dispositif, query.age))
    .filter(dispositif => filterByFrenchLevel(dispositif, query.frenchLevel))
    .filter(dispositif => filterByLanguage(dispositif, query.language));
};
