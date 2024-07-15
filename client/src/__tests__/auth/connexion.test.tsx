import "jest-styled-components";
import mockRouter from "next-router-mock";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import connexion from "../../pages/auth/connexion";
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
        Component: connexion,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("renders connexion if email", () => {
    act(() => {
      mockRouter.push("/auth/connexion?email=test@example.com");
    });
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: connexion,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
