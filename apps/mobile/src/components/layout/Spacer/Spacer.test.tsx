import { render } from "../../utils/tests";
import Spacer from "./Spacer";

describe("Spacer snapshot test suite", () => {
  it("should render without bug / height", async () => {
    const test = await render(<Spacer height={42} />);
    expect(test).toMatchSnapshot();
  });
  it("should render without bug / width", async () => {
    const test = await render(<Spacer width={42} />);
    expect(test).toMatchSnapshot();
  });
  it("should render without bug / height & width", async () => {
    const test = await render(<Spacer height={42} width={42} />);
    expect(test).toMatchSnapshot();
  });
});
