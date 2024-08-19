import FilterButton from "./FilterButton";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";

describe("FilterButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterButton,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        text: "Test choice",
        onPress: () => null,
        isSelected: true,
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render not selected", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterButton,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        text: "Test choice",
        onPress: () => null,
        isSelected: false,
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render with detail", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterButton,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        details: ["First detail", "Second detail"],
        text: "Test choice",
        onPress: () => null,
        isSelected: true,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
