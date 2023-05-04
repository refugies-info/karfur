import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import qs from "query-string";

export const buildUrlQuery = (
  query: Partial<SearchQuery>,
): string => {
  const newQuery = { ...query };
  if (!newQuery.search) newQuery.search = "";
  if (!newQuery.sort) newQuery.sort = "date";
  if (!newQuery.type) newQuery.type = "all";

  return qs.stringify(newQuery, { arrayFormat: "comma", sort: (a, b) => a.localeCompare(b) });
}
