import { RootState } from "../rootReducer";
import { Results, SearchQuery } from "./searchResults.reducer";

export const searchResultsSelector = (state: RootState): Results =>
  state.searchResults.results;

export const searchQuerySelector = (state: RootState): SearchQuery =>
  state.searchResults.query;
