import { SimpleDispositif } from "@refugies-info/api-types";
import { action, ActionType } from "typesafe-actions";
import { ADD_TO_QUERY, SET_NO_RESULTS, SET_RESULTS } from "./searchResults.actionTypes";
import { Results, SearchQuery } from "./searchResults.reducer";

export const setSearchResultsActionCreator = (results: Results) => action(SET_RESULTS, results);
export const setNoResultsActionCreator = (results: SimpleDispositif[]) => action(SET_NO_RESULTS, results);
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

const actions = {
  setSearchResultsActionCreator,
  setNoResultsActionCreator,
  addToQueryActionCreator,
  resetFiltersActionCreator,
};

export type SearchResultsActions = ActionType<typeof actions>;
