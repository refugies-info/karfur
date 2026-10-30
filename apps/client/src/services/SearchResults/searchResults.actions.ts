import { type ActionType, action } from "typesafe-actions";
import { ADD_TO_QUERY } from "./searchResults.actionTypes";
import type { SearchQuery } from "./searchResults.reducer";

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
  addToQueryActionCreator,
  resetFiltersActionCreator,
};

export type SearchResultsActions = ActionType<typeof actions>;
