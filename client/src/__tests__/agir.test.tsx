import "jest-styled-components";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import agir from "../pages/agir";

jest.mock("next/router", () => require("next-router-mock"));

describe("agir", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders traduire", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: agir,
      reduxState: {
        ...initialMockStore,
      },
      compProps: {},
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
