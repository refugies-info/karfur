import React from "react";
import { Text } from "react-native";
import Rows from "./Rows";
import { render } from "../../utils/tests";

describe("Rows snapshot test suite", () => {
  it("should render without bug", () => {
    const test = render(
      <Rows>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Rows>
    );
    expect(test).toMatchSnapshot();
  });

  it("should be able to control flex layout", () => {
    const test = render(
      <Rows layout="1 2" horizontalAlign="center" verticalAlign="space-between">
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Rows>
    );
    expect(test).toMatchSnapshot();
  });
});
