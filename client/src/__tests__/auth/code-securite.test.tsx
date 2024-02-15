import { wrapWithProvidersAndRender } from "../../../jest/lib/wrapWithProvidersAndRender";
import codeSecurite from "../../pages/auth/code-securite";
import mockRouter from "next-router-mock";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/connexion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders null if no email", () => {
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: codeSecurite,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("renders code-securite if email", () => {
    act(() => {
      mockRouter.push("/auth/code-securite?email=test@example.com");
    });
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: codeSecurite,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
