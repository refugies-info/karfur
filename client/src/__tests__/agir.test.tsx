import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import agir from "../pages/agir";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("agir", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component: ReactTestRenderer;

  it("renders traduire", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
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
