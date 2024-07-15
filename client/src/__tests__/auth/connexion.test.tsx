import "jest-styled-components";
import mockRouter from "next-router-mock";
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

  it("renders null if no email", () => {
    const component = wrapWithProvidersAndRenderForTesting({
      Component: connexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
  it("renders connexion if email", async () => {
    await mockRouter.push("/auth/connexion?email=test@example.com");
    const component = wrapWithProvidersAndRenderForTesting({
      Component: connexion,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
