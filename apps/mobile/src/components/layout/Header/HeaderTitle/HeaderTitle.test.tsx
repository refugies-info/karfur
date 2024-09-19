import { render } from "../../../utils/tests";
import HeaderTitle from "./HeaderTitle";

describe("HeaderTitle snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<HeaderTitle>Mon titre</HeaderTitle>);
    expect(test).toMatchSnapshot();
  });
});
