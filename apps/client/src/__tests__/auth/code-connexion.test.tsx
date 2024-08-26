import { initialMockStore } from "@/__fixtures__/reduxStore";
import "jest-styled-components";
import mockRouter from "next-router-mock";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";
import codeConnexion from "../../pages/auth/code-connexion";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/connexion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders null if no email", () => {
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: codeConnexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders code-connexion if email", async () => {
    const url = "http://refugies.info/auth/code-connexion?email=test@example.com";
    Object.defineProperty(window, "location", {
      value: new URL(url),
    });
    await mockRouter.push("/auth/code-connexion?email=test@example.com");
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: codeConnexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
