import { initialMockStore } from "@/__fixtures__/reduxStore";
import { setupGoogleMock } from "@/__mocks__/react-google-autocomplete";
import pageComponent from "@/pages/auth/reinitialiser-mot-de-passe/nouveau";
import "jest-styled-components";
import mockRouter from "next-router-mock";
import { wrapWithProvidersAndRenderForTesting } from "../../../../jest/lib/wrapWithProvidersAndRender";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/reinitialiser-mot-de-passe/nouveau", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders page", async () => {
    await mockRouter.push("/auth/reinitialiser-mot-de-passe/nouveau?token=aaa");
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: pageComponent,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
