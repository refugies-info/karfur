//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import publier from "../pages/publier";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act } from "react-test-renderer";
import "jest-styled-components";
jest.mock("components/Modals/WriteContentModal/WriteContentModal", () => jest.fn().mockReturnValue(<></>));

jest.mock("next/router", () => require("next-router-mock"));

describe("publier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders publier", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: publier,
        reduxState: {
          ...initialMockStore
        }
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
