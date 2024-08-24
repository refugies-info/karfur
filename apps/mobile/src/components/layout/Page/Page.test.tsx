import React from "react";
import { Text } from "react-native";
import Page from "./Page";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { useRoute } from "@react-navigation/native";

describe("Page snapshot test suite", () => {
  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({ routeName: "DummyScreen" });
  });
  it("should render without bug", async () => {
    const component = wrapWithProvidersAndRender({
      Component: Page,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { children: <Text>Test</Text> },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render in loading state", async () => {
    const component = wrapWithProvidersAndRender({
      Component: Page,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { children: <Text>Test</Text>, loading: true },
    });
    expect(component).toMatchSnapshot();
  });
});
