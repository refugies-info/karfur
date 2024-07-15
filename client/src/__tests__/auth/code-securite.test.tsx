import "jest-styled-components";
import mockRouter from "next-router-mock";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import codeSecurite from "../../pages/auth/code-securite";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/connexion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders null if no email", () => {
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: codeSecurite,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("renders code-securite if email", () => {
    const url = "http://refugies.info/auth/code-securite?email=test@example.com";
    Object.defineProperty(window, "location", {
      value: new URL(url),
    });
    act(() => {
      mockRouter.push("/auth/code-securite?email=test@example.com");
    });
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: codeSecurite,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
