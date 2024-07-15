import "jest-styled-components";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import agir from "../pages/agir";

jest.mock("next/router", () => require("next-router-mock"));

describe("agir", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component: ReactTestRenderer;

  it("renders traduire", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: agir,
        reduxState: {
          ...initialMockStore,
        },
        compProps: {},
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
