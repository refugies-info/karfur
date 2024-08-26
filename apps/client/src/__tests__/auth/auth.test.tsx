import { initialMockStore } from "@/__fixtures__/reduxStore";
import "jest-styled-components";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";
import auth from "../../pages/auth";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders auth", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: auth,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
