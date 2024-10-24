import { GetDispositifsResponse, GetNeedResponse, Id, SimpleDispositif } from "@refugies-info/api-types";
import algoliasearch from "algoliasearch";
import { SortOptions } from "~/data/searchFilters";
import { FilterKey, getDisplayRule, RuleKey } from "~/lib/recherche/resultsDisplayRules";
import { sortByDate, sortByLocation, sortByTheme } from "~/lib/recherche/sortContents";
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

const buildFilterKeys = (query: SearchQuery): Array<FilterKey> => {
  let keys: Array<FilterKey> = [];
  if ((query.themes && query.themes.length > 0) || (query.needs && query.needs.length > 0)) {
    keys.push("theme");
  }
  if (query.departments && query.departments.length > 0) {
    keys.push("location");
  }
  if (query.search) {
    keys.push("keywords");
  }
  return keys;
};

export const getDisplayRuleForQuery = (query: SearchQuery, ruleKey: RuleKey | undefined = undefined) => {
  const filterKeys = buildFilterKeys(query);
  return getDisplayRule(query.type, filterKeys, ruleKey || query.sort);
};

export const getDefaultSortOption = (query: SearchQuery): SortOptions => {
  const filterKeys = buildFilterKeys(query);
  const rule = getDisplayRule(query.type, filterKeys, "default");
  switch (rule?.sortFunction) {
    case sortByDate:
      return "date";
    case sortByLocation:
      return "location";
    case sortByTheme:
      return "theme";
    default:
      return "view";
  }
};

/**
 * Filters a list of dispositifs from a query, for primary theme or secondary themes
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param secondaryThemes - boolean. Use the primary or secondary theme to filter.
 * @returns - list of dispositifs
 */
export const filterDispositifs = (
  query: SearchQuery,
  dispositifs: GetDispositifsResponse[],
  secondaryThemes: boolean,
  skip: FilterKey | undefined = undefined,
): GetDispositifsResponse[] => {
  const filterKeys = buildFilterKeys(query);
  const rule = getDisplayRule(query.type, filterKeys, query.sort);

  const filteredDispositifs = dispositifs
    .filter(
      (dispositif) => skip === "theme" || filterByThemeOrNeed(dispositif, query.themes, query.needs, secondaryThemes),
    )
    .filter((dispositif) => skip === "location" || filterByLocations(dispositif, query.departments))
    .filter((dispositif) => skip === "age" || filterByAge(dispositif, query.age))
    .filter((dispositif) => skip === "frenchLevel" || filterByFrenchLevel(dispositif, query.frenchLevel))
    .filter((dispositif) => skip === "language" || filterByLanguage(dispositif, query.language))
    .filter((dispositif) => skip === "public" || filterByPublic(dispositif, query.public))
    .filter((dispositif) => skip === "status" || filterByStatus(dispositif, query.status));

  return rule?.sortFunction && !!skip
    ? [...filteredDispositifs].sort((a, b) => rule.sortFunction(a, b))
    : filteredDispositifs;
};

const filterSuggestions = (
  query: SearchQuery,
  dispositifs: SimpleDispositif[],
  matches: SimpleDispositif[],
  allNeeds: GetNeedResponse[],
): SimpleDispositif[] => {
  // dispositifs which have theme in secondary themes
  let suggestions: SimpleDispositif[] = [];
  if (query.themes.length === 0 && query.needs.length === 0) return suggestions;

  // Get all the dispositifs not selected by the main query
  const remainingDispositifs = dispositifs.filter((dispositif) => !matches.map((d) => d._id).includes(dispositif._id));

  // If themes are selected, the "suggestions" section displays all records that have any of the selected themes as a secondary or tertiary theme.
  if (query.themes.length > 0) {
    suggestions = remainingDispositifs.filter((dispositif) =>
      dispositif.secondaryThemes?.some((theme) => query.themes.includes(theme)),
    );
    // Returns the results here to stop the filtering process
    return suggestions.sort((a, b) => b.nbVues - a.nbVues).slice(0, 8);
  }

  // If needs are selected, the "suggestions" section displays all records
  // that have any of the needs from the same theme except the needs inside query.needs
  if (query.needs.length > 0) {
    // Get the current needs data to build the logic
    const selectedNeeds = allNeeds.filter((need) => query.needs.includes(need._id));
    let selectedNeedsIds: Id[] = [];
    let relatedThemesIds: Id[] = [];

    // Populate 2 arrays with only needs and theme ids to ease the filtering process
    selectedNeeds.map((need) => {
      selectedNeedsIds.push(need._id);
      relatedThemesIds.push(need.theme._id);
    });

    suggestions = remainingDispositifs
      // Only the current themes
      .filter((dispositif) => relatedThemesIds.includes(dispositif.theme as string))
      // Only the ones that DOES NOT have the current selected needs
      .filter((dispositif) => !dispositif.needs.some((need) => selectedNeedsIds.includes(need)));

    // Returns the results here to stop the filtering process
    return suggestions.sort((a, b) => b.nbVues - a.nbVues).slice(0, 8);
  }

  return suggestions;
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
 * Get the 12 top demarches to show when no result
 * @param dispositifs - list of dispositifs
 * @returns - list of dispositifs
 */
export const getTopDemarches = (dispositifs: GetDispositifsResponse[]): GetDispositifsResponse[] => {
  return filterDispositifs(
    {
      type: "demarche",
      sort: "view",
      search: "",
      departments: [],
      themes: [],
      needs: [],
      age: [],
      frenchLevel: [],
      public: [],
      status: [],
      language: [],
    },
    dispositifs,
    false,
  ).slice(0, 12);
};

/**
 * Use the query to filter a list of dispositifs
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param allNeeds - all needs from store
 * @returns - results
 */
export const queryDispositifs = (
  query: SearchQuery,
  dispositifs: GetDispositifsResponse[],
  allNeeds: GetNeedResponse[],
): Results => {
  const matches = filterDispositifs(query, dispositifs, false);
  const suggestions = filterSuggestions(query, dispositifs, matches, allNeeds);

  return {
    matches: matches,
    suggestions: suggestions,
  };
};

/**
 * Use Algolia and the query to filter a list of dispositifs
 * @async
 * @param query - search query
 * @param dispositifs - list of dispositifs
 * @param locale - language to use for Algolia
 * @param needs - all needs from store
 * @returns - results
 */
export const queryDispositifsWithAlgolia = async (
  query: SearchQuery,
  dispositifs: GetDispositifsResponse[],
  locale: string,
  allNeeds: GetNeedResponse[],
): Promise<Results> => {
  const filteredDispositifsByAlgolia = await queryOnAlgolia(query.search, dispositifs, locale);
  return queryDispositifs(query, filteredDispositifsByAlgolia, allNeeds);
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
