import type { SearchCountsResponse } from "../../pages/api/search/counts";
import type { SearchQuery } from "../SearchResults/searchResults.reducer";

export const getSearchCounts = async (searchQuery: SearchQuery): Promise<SearchCountsResponse> => {
  // Exclude presentation-only params from counts: type (tab) and sort
  const { search, sort, type, ...otherFilters } = searchQuery as any;
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
    throw new Error("Failed to fetch search counts");
  }
  return response.json();
};
