import { render } from "../../utils/tests";
import Separator from "./Separator";

describe("Separator snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Separator />);
    expect(test).toMatchSnapshot();
  });
});
