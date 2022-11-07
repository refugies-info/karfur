import React from "react";
import { Text } from "react-native";
import Columns from "./Columns";
import { render } from "../../utils/tests";

describe("Columns snapshot test suite", () => {
  it("should render without bug", () => {
    const test = render(
      <Columns>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Columns>
    );
    expect(test).toMatchSnapshot();
  });

  it("should be able to control flex layout", () => {
    const test = render(
      <Columns
        layout="1 2"
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Columns>
    );
    expect(test).toMatchSnapshot();
  });
});
