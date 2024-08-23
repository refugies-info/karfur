import { render } from "../../utils/tests";
import RadioButton from "./RadioButton";

describe("RadioButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = render(<RadioButton isSelected />);
    expect(test).toMatchSnapshot();
  });
  it("should render not selected", async () => {
    const test = render(<RadioButton isSelected={false} />);
    expect(test).toMatchSnapshot();
  });
});
