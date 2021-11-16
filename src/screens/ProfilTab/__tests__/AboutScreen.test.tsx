import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { AboutScreen } from "../AboutScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { SafeAreaView } = jest.requireActual("react-native-safe-area-context");

  return {
    useSafeAreaInsets: () => ({ insets: { bottom: 0 } }),
    SafeAreaView,
  };
});

describe("About screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: AboutScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
  });
});
