import { GetDispositifsResponse, Id } from "@refugies-info/api-types";
import { AgeOptions, FrenchOptions, PublicOptions, SortOptions, StatusOptions, TypeOptions } from "data/searchFilters";
import { createReducer } from "typesafe-actions";
import { SearchResultsActions } from "./searchResults.actions";

export type Results = {
  matches: GetDispositifsResponse[];
  suggestions: GetDispositifsResponse[];
};

export type SearchQuery = {
  search: string;
  departments: string[];
  themes: Id[];
  needs: Id[];
  age: AgeOptions[];
  frenchLevel: FrenchOptions[];
  public: PublicOptions[];
  status: StatusOptions[];
  language: string[];
  sort: SortOptions;
  type: TypeOptions;
};

export interface SearchResultsState {
  results: Results;
  query: SearchQuery;
}

const initialSearchResultsState: SearchResultsState = {
  results: {
    matches: [],
    suggestions: [],
  },
  query: {
    search: "",
    departments: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    language: [],
    public: [],
    status: [],
    sort: "default",
    type: "all",
  },
};

export const searchResultsReducer = createReducer<SearchResultsState, SearchResultsActions>(initialSearchResultsState, {
  SET_RESULTS: (state, action) => ({ ...state, results: action.payload }),
  ADD_TO_QUERY: (state, action) => ({ ...state, query: { ...state.query, ...action.payload } }),
});
