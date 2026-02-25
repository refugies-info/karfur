import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../__mocks__/react-google-autocomplete";
import recherche from "../pages/recherche";

jest.mock("next/router", () => require("next-router-mock"));

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
      reduxState: {
        ...initialMockStore,
        searchCounts: {
          data: {
            themes: {},
            needs: {},
            frenchLevels: {},
            ageRanges: {},
            publics: {},
            languages: {},
            statuses: {},
            types: { dispositif: 0, demarche: 0, online: 0 },
            total: 0,
          },
          loading: false,
          error: null,
        },
        searchResults: {
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
            themes: ["6319f6b363ab2bbb162d7df5"],
            needs: [],
            age: [],
            frenchLevel: [],
            language: [],
            public: [],
            status: [],
            sort: "default",
            type: "all",
          },
        },
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
