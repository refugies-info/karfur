import { initialMockStore } from "@/__fixtures__/reduxStore";
import "jest-styled-components";
import mockRouter from "next-router-mock";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";
import connexion from "../../pages/auth/connexion";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/connexion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders null if no email", () => {
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: connexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders connexion if email", async () => {
    await mockRouter.push("/auth/connexion?email=test@example.com");
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: connexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
