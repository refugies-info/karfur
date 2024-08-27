import qs from "query-string";
import { SearchQuery } from "~/services/SearchResults/searchResults.reducer";

export const buildUrlQuery = (query: Partial<SearchQuery>, utmQuery?: any): string => {
  const newQuery = { ...query, ...(utmQuery || {}) };
  if (!newQuery.search) newQuery.search = "";
  if (!newQuery.sort) newQuery.sort = "date";
  if (!newQuery.type) newQuery.type = "all";

  return qs.stringify(newQuery, { arrayFormat: "comma", sort: (a, b) => a.localeCompare(b) });
};
