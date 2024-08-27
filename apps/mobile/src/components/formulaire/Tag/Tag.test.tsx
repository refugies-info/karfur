import { render } from "../../utils/tests";
import Tag from "./Tag";

describe("Tag snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Tag onRemove={() => {}}>Test</Tag>);
    expect(test).toMatchSnapshot();
  });
});
