import { Text } from "react-native";
import { render } from "../../utils/tests";
import Content from "./Content";

describe("Content snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <Content>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Content>,
    );
    expect(test).toMatchSnapshot();
  });
});
