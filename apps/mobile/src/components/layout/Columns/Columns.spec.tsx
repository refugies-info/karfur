import { Text } from "react-native";
import { render } from "../../utils/tests";
import Columns from "./Columns";

describe("Columns snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <Columns>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Columns>,
    );
    expect(test).toMatchSnapshot();
  });

  it("should be able to control flex layout", async () => {
    const test = await render(
      <Columns layout="1 2" horizontalAlign="space-between" verticalAlign="center">
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </Columns>,
    );
    expect(test).toMatchSnapshot();
  });
});
