import "jest-styled-components";
import { initialMockStore } from "~/__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../__mocks__/react-google-autocomplete";
import recherche from "../pages/recherche";

jest.mock("next/router", () => require("next-router-mock"));

describe("recherche", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders search results", () => {
    window.scrollTo = jest.fn();

    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: recherche,
      reduxState: {
        ...initialMockStore,
        searchResults: {
          results: {
            matches: [],
            suggestions: [],
          },
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
