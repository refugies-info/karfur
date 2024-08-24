import React from "react";
import { Text } from "react-native";
import Content from "./Content";
import { render } from "../../utils/tests";

describe("Content snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <Content>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Content>
    );
    expect(test).toMatchSnapshot();
  });
});
