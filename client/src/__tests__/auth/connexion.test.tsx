import { wrapWithProvidersAndRender } from "../../../jest/lib/wrapWithProvidersAndRender";
import connexion from "../../pages/auth/connexion";
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
      component = wrapWithProvidersAndRender({
        Component: connexion,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
