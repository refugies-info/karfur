import { GetDispositifsResponse } from "@refugies-info/api-types";
import algoliasearch from "algoliasearch";
import { FilterKey, getDisplayRule } from "~/lib/recherche/resultsDisplayRules";
import { Results, SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  filterByAge,
  filterByFrenchLevel,
  filterByLanguage,
  filterByLocations,
  filterByPublic,
  filterByStatus,
  filterByThemeOrNeed,
} from "./filterContents";
import { getSearchableAttributes, Hit } from "./getAlgoliaSearchableAttributes";

const searchClient = algoliasearch("L9HYT1676M", process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_API_KEY || "");
const indexName =
  process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
    ? process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_PROD
    : process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_STG;
const index = searchClient.initIndex(indexName || "");

export const buildFilters = (query: SearchQuery): Array<FilterKey> => {
  let filters: Array<FilterKey> = [];
  if ((query.themes && query.themes.length > 0) || (query.needs && query.needs.length > 0)) {
    filters.push("theme");
  }
  if (query.departments && query.departments.length > 0) {
    filters.push("location");
  }
  if (query.search) {
    filters.push("keywords");
  }
  return filters;
};

/**
 * Filters a list of dispositifs from a query, for primary theme or secondary themes
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param secondaryThemes - boolean. Use the primary or secondary theme to filter.
 * @returns - list of dispositifs
 */
const filterDispositifs = (
  query: SearchQuery,
  dispositifs: GetDispositifsResponse[],
  secondaryThemes: boolean,
): GetDispositifsResponse[] => {
  const filters = buildFilters(query);
  const rule = getDisplayRule(query.type, filters, query.sort);
  const filteredDispositifs = dispositifs
    .filter((dispositif) => filterByThemeOrNeed(dispositif, query.themes, query.needs, secondaryThemes))
    .filter((dispositif) => filterByLocations(dispositif, query.departments))
    .filter((dispositif) => filterByAge(dispositif, query.age))
    .filter((dispositif) => filterByFrenchLevel(dispositif, query.frenchLevel))
    .filter((dispositif) => filterByLanguage(dispositif, query.language))
    .filter((dispositif) => filterByPublic(dispositif, query.public))
    .filter((dispositif) => filterByStatus(dispositif, query.status));
  return rule?.sortFunction ? [...filteredDispositifs].sort((a, b) => rule.sortFunction(a, b)) : filteredDispositifs;
};

let searchCache = "";
let searchCacheResults: GetDispositifsResponse[] = [];
const queryOnAlgolia = async (search: string, dispositifs: GetDispositifsResponse[], locale: string) => {
  let filteredDispositifsByAlgolia: GetDispositifsResponse[] = [...dispositifs];
  if (search) {
    if (search !== searchCache) {
      // new search
      searchCache = search; // keep search in cache to prevent useless algolia searchs
      let hits: Hit[] = [];
      const queryLanguages: string[] = ["fr"];
      // ti not supported by Algolia
      if (!["ti", "fr"].includes(locale)) {
        queryLanguages.push(locale);
      }
      hits = await index
        .search(search, {
          restrictSearchableAttributes: getSearchableAttributes(locale),
          analyticsTags: [`ln_${locale}`],
          queryLanguages,
          hitsPerPage: 600,
        })
        .then(({ hits }) => hits.map((h) => ({ id: h.objectID, highlight: h._highlightResult })));

      filteredDispositifsByAlgolia = hits
        .map((hit) => {
          const dispositif = dispositifs.find((d) => d._id.toString() === hit.id);
          // deep clone object to make sure cards components re-renders
          const newDispositif: GetDispositifsResponse | undefined = dispositif
            ? JSON.parse(JSON.stringify(dispositif))
            : undefined;
          if (newDispositif) {
            newDispositif.abstract = hit.highlight[`abstract_${locale}`]?.value || newDispositif.abstract;
            newDispositif.titreInformatif = hit.highlight[`title_${locale}`]?.value || newDispositif.titreInformatif;
            newDispositif.titreMarque = hit.highlight[`titreMarque_${locale}`]?.value || newDispositif.titreMarque;
            // newDispositif.mainSponsor.nom = hit.highlight.sponsorName.value;
          }
          return newDispositif;
        })
        .filter((d) => !!d) as GetDispositifsResponse[];
      searchCacheResults = filteredDispositifsByAlgolia;
    } else {
      // same search
      filteredDispositifsByAlgolia = [...searchCacheResults];
    }
  }
  return filteredDispositifsByAlgolia;
};

/**
 * Use the query to filter a list of dispositifs
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @returns - results
 */
export const queryDispositifs = (query: SearchQuery, dispositifs: GetDispositifsResponse[]): Results => {
  const matches = filterDispositifs(query, dispositifs, false);

  // dispositifs which have theme in secondary themes
  let suggestions: GetDispositifsResponse[] = [];
  if (query.themes.length > 0) {
    const remainingDispositifs = [...dispositifs] // remove dispositifs already selected
      .filter((dispositif) => !matches.map((d) => d._id).includes(dispositif._id));
    suggestions = filterDispositifs(query, remainingDispositifs, true);
  }

  return {
    matches: matches,
    suggestions,
  };
};

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
  dispositifs: GetDispositifsResponse[],
  locale: string,
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
  dispositifs: GetDispositifsResponse[],
  locale: string,
): Promise<GetDispositifsResponse[]> => {
  const filteredDispositifsByAlgolia = await queryOnAlgolia(query.search, dispositifs, locale);
  return [...filteredDispositifsByAlgolia]
    .filter((dispositif) => filterByLocations(dispositif, query.departments))
    .filter((dispositif) => filterByAge(dispositif, query.age))
    .filter((dispositif) => filterByFrenchLevel(dispositif, query.frenchLevel))
    .filter((dispositif) => filterByLanguage(dispositif, query.language));
};
