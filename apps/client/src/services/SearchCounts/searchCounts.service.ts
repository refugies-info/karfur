import { SearchCountsResponse } from "../../pages/api/search/counts";
import { SearchQuery } from "../SearchResults/searchResults.reducer";

export const getSearchCounts = async (searchQuery: SearchQuery): Promise<SearchCountsResponse> => {
  const { search, ...otherFilters } = searchQuery;
  const params = {
    ...otherFilters,
    query: search,
  };

  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/search/counts?${queryString}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search counts");
  }
  return response.json();
};
