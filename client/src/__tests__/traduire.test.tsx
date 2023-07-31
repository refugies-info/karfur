import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import traduire from "../pages/traduire";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("traduire", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component: ReactTestRenderer;

  it("renders traduire", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
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
