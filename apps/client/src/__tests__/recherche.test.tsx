import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../__mocks__/react-google-autocomplete";
import type { SearchResponse } from "../lib/search-helpers";
import recherche from "../pages/recherche";
import type { SearchQuery } from "../services/SearchResults/searchResults.reducer";

jest.mock("next/router", () => require("next-router-mock"));

const initialQuery: SearchQuery = {
  search: "",
  departments: [],
  themes: ["6319f6b363ab2bbb162d7df5"],
  needs: [],
  age: [],
  frenchLevel: [],
  language: [],
  public: [],
  status: [],
  sort: "default",
  type: "all",
};

const emptyResults: SearchResponse = {
  results: [],
  suggestions: [],
  noResults: [],
  total: 0,
  programCount: 0,
  procedureCount: 0,
  onlineCount: 0,
  page: 1,
  pageCount: 0,
};

describe("recherche", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
    // Pin env var so snapshot is deterministic regardless of local .env
    process.env = { ...originalEnv, NEXT_PUBLIC_DISABLE_SEARCH_COUNTS: "true" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders search results", () => {
    window.scrollTo = jest.fn();

    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: recherche,
      compProps: { initialQuery, initialResults: emptyResults, initialCounts: null },
      reduxState: {
        ...initialMockStore,
        searchResults: {
          results: {
            matches: [],
            suggestions: [],
          },
          noResults: [],
          query: initialQuery,
        },
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
