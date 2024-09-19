import { Text } from "react-native";
import { render } from "../../utils/tests";
import RadioGroup from "./RadioGroup";

describe("RadioGroup snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <RadioGroup>
        <Text>Test</Text>
      </RadioGroup>,
    );
    expect(test).toMatchSnapshot();
  });
});
