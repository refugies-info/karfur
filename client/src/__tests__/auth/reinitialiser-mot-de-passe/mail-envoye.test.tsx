import "jest-styled-components";
import mockRouter from "next-router-mock";
import pageComponent from "pages/auth/reinitialiser-mot-de-passe/mail-envoye";
import { act, ReactTestRenderer } from "react-test-renderer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
import { wrapWithProvidersAndRenderForTesting } from "../../../../jest/lib/wrapWithProvidersAndRender";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/reinitialiser-mot-de-passe/mail-envoye", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders page", () => {
    act(() => {
      mockRouter.push("/auth/reinitialiser-mot-de-passe/mail-envoye?email=test@example.com");
    });
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: pageComponent,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
