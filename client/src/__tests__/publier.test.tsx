import "jest-styled-components";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../jest/lib/wrapWithProvidersAndRender";
import publier from "../pages/publier";

jest.mock("components/Modals/WriteContentModal/WriteContentModal", () => jest.fn().mockReturnValue(<></>));
jest.mock("next/router", () => require("next-router-mock"));

describe("publier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let component: ReactTestRenderer;
  it("renders publier", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: publier,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
