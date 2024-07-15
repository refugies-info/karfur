import "jest-styled-components";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import traduire from "../pages/traduire";

jest.mock("next/router", () => require("next-router-mock"));

describe("traduire", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component: ReactTestRenderer;

  it("renders traduire", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: traduire,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {
          translationStatistics: {
            nbTranslators: 12,
            nbWordsTranslated: 156,
            nbActiveTranslators: [
              { languageId: "en", count: 4 },
              { languageId: "ru", count: 2 },
            ],
          },
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
