import { wrapWithProvidersAndRender } from "../../../../jest/lib/wrapWithProvidersAndRender";
import pageComponent from "pages/auth/reinitialiser-mot-de-passe/nouveau";
import mockRouter from "next-router-mock";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act, ReactTestRenderer } from "react-test-renderer";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));

describe("auth/reinitialiser-mot-de-passe/nouveau", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  let component: ReactTestRenderer;

  it("renders page", () => {
    act(() => {
      mockRouter.push("/auth/reinitialiser-mot-de-passe/nouveau?token=aaa");
    });
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: pageComponent,
        reduxState: {
          ...initialMockStore,
        },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
