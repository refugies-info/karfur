import "jest-styled-components";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import auth from "../../pages/auth";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders auth", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: auth,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
