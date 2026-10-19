import type { Id, SimpleDispositif } from "@refugies-info/api-types";
import type {
  AgeOptions,
  FrenchOptions,
  PublicOptions,
  SortOptions,
  StatusOptions,
  TypeOptions,
} from "data/searchFilters";
import type { Reducer } from "redux";
import { getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import type { SearchResultsActions } from "./searchResults.actions";
import { ADD_TO_QUERY, SET_NO_RESULTS, SET_RESULTS } from "./searchResults.actionTypes";

export type Results = {
  algolia?: SimpleDispositif[];
  matches: SimpleDispositif[];
  suggestions: SimpleDispositif[];
};

export type SearchQuery = {
  search: string;
  departments: string[];
  cities?: string[];
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
  noResults: SimpleDispositif[];
  query: SearchQuery;
}

const initialSearchResultsState: SearchResultsState = {
  results: {
    matches: [],
    suggestions: [],
  },
  noResults: [],
  query: {
    search: "",
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
  },
};

export const searchResultsReducer: Reducer<SearchResultsState, SearchResultsActions> = (
  state = initialSearchResultsState,
  action,
) => {
  switch (action.type) {
    case SET_RESULTS:
      return { ...state, results: action.payload as Results };
    case SET_NO_RESULTS:
      return { ...state, noResults: action.payload as SimpleDispositif[] };
    case ADD_TO_QUERY: {
      const query = { ...state.query, ...(action.payload as Partial<SearchQuery>) };
      const rule = getDisplayRuleForQuery(query);
      return {
        ...state,
        query: { ...query, sort: !rule?.display ? "default" : query.sort },
      };
    }

    default:
      return state;
  }
};
