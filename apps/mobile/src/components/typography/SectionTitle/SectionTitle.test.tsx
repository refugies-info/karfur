import { render } from "../../utils/tests";
import SectionTitle from "./SectionTitle";

describe("SectionTitle snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<SectionTitle>Mon sous titre</SectionTitle>);
    expect(test).toMatchSnapshot();
  });
});
