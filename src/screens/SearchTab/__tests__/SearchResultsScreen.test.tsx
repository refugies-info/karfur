import { SearchResultsScreen } from "../SearchResultsScreen";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";

jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { SafeAreaView } = jest.requireActual("react-native-safe-area-context");

  return {
    useSafeAreaInsets: () => ({ insets: { bottom: 0 } }),
    SafeAreaView,
  };
});

describe("Search results screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should render correctly", () => {
    const component = wrapWithProvidersAndRender({
      Component: SearchResultsScreen,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
      },
    });
    expect(component).toMatchSnapshot();
  });
});
