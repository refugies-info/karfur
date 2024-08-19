import React from "react";
import ChoiceButton from "./ChoiceButton";
import { render } from "../../utils/tests";
import { Text } from "react-native";

describe("ChoiceButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <ChoiceButton testID="testID" onPress={() => null} isSelected>
        <Text>Langue</Text>
      </ChoiceButton>
    );
    expect(test).toMatchSnapshot();
  });
  it("should render not selected", async () => {
    const test = await render(
      <ChoiceButton testID="testID" onPress={() => null} isSelected={false}>
        <Text>Langue</Text>
      </ChoiceButton>
    );
    expect(test).toMatchSnapshot();
  });
  it("should render with flatStyle", async () => {
    const test = await render(
      <ChoiceButton testID="testID" onPress={() => null} isSelected flatStyle>
        <Text>Test</Text>
      </ChoiceButton>
    );
    expect(test).toMatchSnapshot();
  });
  it("should render with without radio", async () => {
    const test = await render(
      <ChoiceButton testID="testID" onPress={() => null} isSelected hideRadio>
        <Text>Test</Text>
      </ChoiceButton>
    );
    expect(test).toMatchSnapshot();
  });
});
