import type { GetNeedResponse, Id, SimpleDispositif } from "@refugies-info/api-types";
import type { SortOptions } from "~/data/searchFilters";
import { type FilterKey, getDisplayRule, type RuleKey } from "~/lib/recherche/resultsDisplayRules";
import { sortByDate, sortByLocation, sortByTheme } from "~/lib/recherche/sortContents";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  filterByAge,
  filterByFrenchLevel,
  filterByLanguage,
  filterByLocations,
  filterByPublic,
  filterByStatus,
  filterByThemeOrNeed,
} from "./filterContents";

const buildFilterKeys = (query: SearchQuery): Array<FilterKey> => {
  const keys: Array<FilterKey> = [];
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

export const getDisplayRuleForQuery = (
  query: SearchQuery,
  ruleKey: RuleKey | undefined = undefined,
) => {
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
      return "views";
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
  dispositifs: SimpleDispositif[],
  secondaryThemes: boolean,
  skip: FilterKey | undefined = undefined,
  allNeeds?: GetNeedResponse[],
): SimpleDispositif[] => {
  const filterKeys = buildFilterKeys(query);
  const rule = getDisplayRule(query.type, filterKeys, query.sort);

  const inferedThemes: Id[] | undefined =
    query.themes.length === 0 && query.needs && query.needs.length > 0
      ? [
          ...new Set(
            allNeeds
              ?.filter((currentNeed) =>
                query.needs.some((needId) => String(currentNeed._id) === String(needId)),
              )
              .map((need) => need.theme._id),
          ),
        ]
      : undefined;

  let filteredDispositifs = dispositifs;

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) =>
      skip === "theme" ||
      filterByThemeOrNeed(dispositif, query.themes, query.needs, secondaryThemes, inferedThemes),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "location" || filterByLocations(dispositif, query.departments),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "age" || filterByAge(dispositif, query.age),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "frenchLevel" || filterByFrenchLevel(dispositif, query.frenchLevel),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "language" || filterByLanguage(dispositif, query.language),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "public" || filterByPublic(dispositif, query.public),
  );

  filteredDispositifs = filteredDispositifs.filter(
    (dispositif) => skip === "status" || filterByStatus(dispositif, query.status),
  );

  return rule?.sortFunction && !skip
    ? [...filteredDispositifs].sort((a, b) => rule.sortFunction(a, b))
    : filteredDispositifs;
};

/**
 * Get the 12 top demarches to show when no result
 * @param dispositifs - list of dispositifs
 * @returns - list of dispositifs
 */
export const getTopDemarches = (dispositifs: SimpleDispositif[]): SimpleDispositif[] => {
  return filterDispositifs(
    {
      type: "demarche",
      sort: "views",
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
