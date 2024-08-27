import { useRoute } from "@react-navigation/native";
import { Text } from "react-native";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import PageOnboarding from "./PageOnboarding";

describe("PageOnboarding snapshot test suite", () => {
  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({ routeName: "DummyScreen" });
  });
  it("should render without bug", async () => {
    const component = wrapWithProvidersAndRender({
      Component: PageOnboarding,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { children: <Text>Test</Text> },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render in loading state", async () => {
    const component = wrapWithProvidersAndRender({
      Component: PageOnboarding,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { children: <Text>Test</Text>, loading: true },
    });
    expect(component).toMatchSnapshot();
  });
});
