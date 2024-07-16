import "jest-styled-components";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import publier from "../pages/publier";

jest.mock("components/Modals/WriteContentModal/WriteContentModal", () => jest.fn().mockReturnValue(<></>));
jest.mock("next/router", () => require("next-router-mock"));

describe("publier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders publier", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: publier,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
