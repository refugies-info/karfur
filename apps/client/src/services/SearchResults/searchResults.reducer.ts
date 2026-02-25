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
import type { SearchResultsActions, ServerSearchAction } from "./searchResults.actions";
import {
  ADD_TO_QUERY,
  APPEND_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_SUCCESS,
  SET_NO_RESULTS,
  SET_RESULTS,
  SET_SEARCH_LOADING,
} from "./searchResults.actionTypes";

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

export interface PaginationState {
  page: number;
  pageCount: number;
  total: number;
}

export interface SearchResultsState {
  results: Results;
  pagination: PaginationState;
  loading: boolean;
  noResults: SimpleDispositif[];
  query: SearchQuery;
}

const initialSearchResultsState: SearchResultsState = {
  results: {
    matches: [],
    suggestions: [],
  },
  pagination: {
    page: 1,
    pageCount: 0,
    total: 0,
  },
  loading: false,
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

export const searchResultsReducer: Reducer<
  SearchResultsState,
  SearchResultsActions | ServerSearchAction
> = (state = initialSearchResultsState, action) => {
  switch (action.type) {
    // Legacy actions (still used by embed.tsx & filter components)
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

    // Server-side search actions
    case SET_SEARCH_LOADING:
      return { ...state, loading: action.payload as boolean };
    case FETCH_SEARCH_RESULTS_SUCCESS: {
      const response = action.payload as any;
      return {
        ...state,
        loading: false,
        results: {
          matches: response.results,
          suggestions: response.suggestions || [],
        },
        pagination: {
          page: response.page,
          pageCount: response.pageCount,
          total: response.total,
        },
      };
    }
    case APPEND_SEARCH_RESULTS: {
      const response = action.payload as any;
      return {
        ...state,
        loading: false,
        results: {
          ...state.results,
          matches: [...state.results.matches, ...response.results],
        },
        pagination: {
          page: response.page,
          pageCount: response.pageCount,
          total: response.total,
        },
      };
    }
    case FETCH_SEARCH_RESULTS_FAILURE:
      return { ...state, loading: false };

    default:
      return state;
  }
};
