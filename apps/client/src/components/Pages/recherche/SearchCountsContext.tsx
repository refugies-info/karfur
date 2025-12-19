import { createContext, useContext } from "react";
import type { SearchCountsResponse } from "~/pages/api/search/counts";

export const SearchCountsContext = createContext<SearchCountsResponse | null>(null);

export const useSearchCounts = () => {
  const context = useContext(SearchCountsContext);
  if (context === undefined) {
    throw new Error("useSearchCounts must be used within a SearchCountsProvider");
  }
  return context;
};
