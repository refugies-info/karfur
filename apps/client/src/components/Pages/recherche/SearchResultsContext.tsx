import type { SimpleDispositif } from "@refugies-info/api-types";
import { createContext, useContext } from "react";

export interface SearchResultsContextValue {
  results: SimpleDispositif[];
  totalResultsCount: number;
}

export const SearchResultsContext = createContext<SearchResultsContextValue | null>(null);

export const useSearchResultsContext = (): SearchResultsContextValue => {
  const context = useContext(SearchResultsContext);
  if (context === null) {
    throw new Error("useSearchResultsContext must be used within a SearchResultsContext.Provider");
  }
  return context;
};
