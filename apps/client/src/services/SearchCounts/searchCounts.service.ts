import type { SearchCountsResponse } from "../../pages/api/search/counts";
import type { SearchQuery } from "../SearchResults/searchResults.reducer";

export const SEARCH_COUNTS_CACHE_KEY = "search-counts";

// Presentation-only params (type tab and sort) are not part of the counts query
export type SearchCountsQuery = Omit<SearchQuery, "sort" | "type">;

export const getSearchCounts = async (
  searchQuery: SearchCountsQuery,
): Promise<SearchCountsResponse> => {
  const { search, ...otherFilters } = searchQuery;
  const params = {
    ...otherFilters,
    query: search,
  };

  const usp = new URLSearchParams();
  Object.entries(params as Record<string, any>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && String(v).length > 0) usp.append(key, String(v));
      });
    } else {
      usp.append(key, String(value));
    }
  });

  const queryString = usp.toString();
  const response = await fetch(`/api/search/counts?${queryString}`);
  if (!response.ok) {
    throw new Error(`/api/search/counts responded ${response.status}`);
  }
  return response.json();
};
