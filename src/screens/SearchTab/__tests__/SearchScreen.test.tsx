import { SearchScreen } from "../SearchScreen";
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

jest.mock("@react-navigation/native", () => {
  return {
    useRoute: () => ({ name: "LanguageChoiceScreen" }),
  };
});

describe("Search Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "LanguageChoiceScreen"
    });
  });

  it("should render correctly", () => {
    const component = wrapWithProvidersAndRender({
      Component: SearchScreen,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
      },
    });
    expect(component).toMatchSnapshot();
  });
});
