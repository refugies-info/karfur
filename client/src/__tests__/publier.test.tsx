//@ts-nocheck
import { wrapWithProvidersAndRender } from "../../jest/lib/wrapWithProvidersAndRender";
import publier from "../pages/publier";
import { initialMockStore } from "__fixtures__/reduxStore";
import { act } from "react-test-renderer";
import "jest-styled-components";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next/image", () => {
  const Image = () => <></>;
  return Image;
});

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
