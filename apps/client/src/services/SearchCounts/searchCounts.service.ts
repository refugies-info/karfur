import { SearchCountsResponse } from "../../pages/api/search/counts";
import { SearchQuery } from "../SearchResults/searchResults.reducer";

export const getSearchCounts = async (query: SearchQuery): Promise<SearchCountsResponse> => {
  const queryString = new URLSearchParams(query as any).toString();
  const response = await fetch(`/api/search/counts?${queryString}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search counts");
  }
  return response.json();
};
