import "jest-styled-components";
import mockRouter from "next-router-mock";
import pageComponent from "pages/auth/reinitialiser-mot-de-passe";
import { initialMockStore } from "__fixtures__/reduxStore";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
import { wrapWithProvidersAndRenderForTesting } from "../../../../jest/lib/wrapWithProvidersAndRender";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/reinitialiser-mot-de-passe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders page if no email", () => {
    const component = wrapWithProvidersAndRenderForTesting({
      Component: pageComponent,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
  it("renders page if email", async () => {
    await mockRouter.push("/auth/reinitialiser-mot-de-passe?email=test@example.com");
    const component = wrapWithProvidersAndRenderForTesting({
      Component: pageComponent,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
