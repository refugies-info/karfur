import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { Header } from "../Header";

describe("Header", () => {
  it("should render correctly", () => {
    const component = wrapWithProvidersAndRender({ Component: Header });
    expect(component).toMatchSnapshot();
  });
});
