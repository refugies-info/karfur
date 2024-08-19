import React from "react";
import { Text } from "react-native";
import RadioGroup from "./RadioGroup";
import { render } from "../../utils/tests";

describe("RadioGroup snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <RadioGroup>
        <Text>Test</Text>
      </RadioGroup>
    );
    expect(test).toMatchSnapshot();
  });
});
