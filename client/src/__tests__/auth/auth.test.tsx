import { wrapWithProvidersAndRender } from "../../../jest/lib/wrapWithProvidersAndRender";
import auth from "../../pages/auth";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import { setupGoogleMock } from "../../__mocks__/react-google-autocomplete";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders auth", () => {
    window.scrollTo = jest.fn();
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: auth,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
