import { render } from "../../utils/tests";
import Title from "./Title";

describe("Title snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Title>Mon titre</Title>);
    expect(test).toMatchSnapshot();
  });
});
