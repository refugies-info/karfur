import { render } from "../../../utils/tests";
import FlexItem from "./FlexItem";

describe("FlexItem snapshot test suite", () => {
  it("should render without bug", async () => {
    expect(await render(<FlexItem flex="1" marginBottom="nospace" marginRight="default" />)).toMatchSnapshot();
  });

  it("should accept non float value as flex prop", async () => {
    expect(await render(<FlexItem flex="50px" />)).toMatchSnapshot();
  });
});
