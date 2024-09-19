import { Text } from "react-native";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import Select from "./Select";

describe("Select snapshot test suite", () => {
  it("should render without bug", async () => {
    const component = wrapWithProvidersAndRender({
      Component: Select,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        text: <Text>Langue</Text>,
        onPress: () => null,
      },
    });

    expect(component).toMatchSnapshot();
  });
  it("should render with label", async () => {
    const component = wrapWithProvidersAndRender({
      Component: Select,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: {
        text: <Text>English</Text>,
        label: "Langue",
        onPress: () => null,
      },
    });

    expect(component).toMatchSnapshot();
  });
});
