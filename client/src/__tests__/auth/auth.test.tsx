import "jest-styled-components";
import { initialMockStore } from "__fixtures__/reduxStore";
import { wrapWithProvidersAndRenderForTesting } from "../../../jest/lib/wrapWithProvidersAndRender";
import auth from "../../pages/auth";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("renders auth", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRenderForTesting({
      Component: auth,
      reduxState: {
        ...initialMockStore,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
