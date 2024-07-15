import "jest-styled-components";
import mockRouter from "next-router-mock";
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

  it("renders null if no email", () => {
    const component = wrapWithProvidersAndRenderForTesting({
      Component: codeSecurite,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
  it("renders code-securite if email", async () => {
    const url = "http://refugies.info/auth/code-securite?email=test@example.com";
    Object.defineProperty(window, "location", {
      value: new URL(url),
    });
    await mockRouter.push("/auth/code-securite?email=test@example.com");
    const component = wrapWithProvidersAndRenderForTesting({
      Component: codeSecurite,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
