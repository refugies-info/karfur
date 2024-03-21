import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import recherche from "../pages/recherche";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import { setupGoogleMock } from "../__mocks__/react-google-autocomplete";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("recherche", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders search results", () => {
    window.scrollTo = jest.fn();

    act(() => {
      component = wrapWithProvidersAndRender({
        Component: recherche,
        reduxState: {
          ...initialMockStore,
          searchResults: {
            results: {
              dispositifs: [],
              demarches: [],
              dispositifsSecondaryTheme: [],
            },
            query: {
              search: "",
              departments: [],
              themes: ["6319f6b363ab2bbb162d7df5"],
              needs: [],
              age: [],
              frenchLevel: [],
              language: [],
              sort: "date",
              type: "all",
            },
            inputFocused: {
              search: false,
              location: false,
              theme: false,
            },
          },
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
