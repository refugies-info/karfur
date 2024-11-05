import { Text } from "react-native";
import { render } from "../../utils/tests";
import Rows from "./Rows";

describe("Rows snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <Rows>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Rows>,
    );
    expect(test).toMatchSnapshot();
  });

  it("should be able to control flex layout", async () => {
    const test = await render(
      <Rows layout="1 2" horizontalAlign="center" verticalAlign="space-between">
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Rows>,
    );
    expect(test).toMatchSnapshot();
  });
});
