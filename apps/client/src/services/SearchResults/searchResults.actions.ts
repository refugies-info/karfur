import type { SimpleDispositif } from "@refugies-info/api-types";
import { type ActionType, action } from "typesafe-actions";
import type { SearchResponse } from "~/lib/search-helpers";
import {
  ADD_TO_QUERY,
  APPEND_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_NEXT_PAGE,
  FETCH_SEARCH_RESULTS_REQUEST,
  FETCH_SEARCH_RESULTS_SUCCESS,
  SET_NO_RESULTS,
  SET_RESULTS,
  SET_SEARCH_LOADING,
} from "./searchResults.actionTypes";
import type { Results, SearchQuery } from "./searchResults.reducer";

// Legacy actions (still used by embed.tsx & filter components)
export const setSearchResultsActionCreator = (results: Results) => action(SET_RESULTS, results);
export const setNoResultsActionCreator = (results: SimpleDispositif[]) =>
  action(SET_NO_RESULTS, results);
export const addToQueryActionCreator = (query: Partial<SearchQuery>) => action(ADD_TO_QUERY, query);

export const resetFiltersActionCreator = (search: string) =>
  action(ADD_TO_QUERY, {
    search,
    departments: [],
    cities: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    language: [],
    public: [],
    status: [],
    sort: "default",
    type: "all",
  } as SearchQuery);

// Server-side search actions
export const fetchSearchResultsRequest = (query: SearchQuery) =>
  ({ type: FETCH_SEARCH_RESULTS_REQUEST, payload: query }) as const;

export const fetchSearchResultsNextPage = () => ({ type: FETCH_SEARCH_RESULTS_NEXT_PAGE }) as const;

export const fetchSearchResultsSuccess = (response: SearchResponse) =>
  ({ type: FETCH_SEARCH_RESULTS_SUCCESS, payload: response }) as const;

export const appendSearchResults = (response: SearchResponse) =>
  ({ type: APPEND_SEARCH_RESULTS, payload: response }) as const;

export const fetchSearchResultsFailure = (error: string) =>
  ({ type: FETCH_SEARCH_RESULTS_FAILURE, payload: error }) as const;

export const setSearchLoading = (loading: boolean) =>
  ({ type: SET_SEARCH_LOADING, payload: loading }) as const;

const actions = {
  setSearchResultsActionCreator,
  setNoResultsActionCreator,
  addToQueryActionCreator,
  resetFiltersActionCreator,
};

export type SearchResultsActions = ActionType<typeof actions>;

export type ServerSearchAction =
  | ReturnType<typeof fetchSearchResultsRequest>
  | ReturnType<typeof fetchSearchResultsNextPage>
  | ReturnType<typeof fetchSearchResultsSuccess>
  | ReturnType<typeof appendSearchResults>
  | ReturnType<typeof fetchSearchResultsFailure>
  | ReturnType<typeof setSearchLoading>;
