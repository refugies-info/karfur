import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { HeaderWithLogo } from "../HeaderWithLogo";
import i18n from "../../services/i18n";

jest.mock("../../services/i18n", () => ({
  __esModule: true, // this property makes it work
  default: { isRTL: jest.fn() },
}));

jest.mock("../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../utils/logEvent", () => ({
  logEventInFirebase: jest.fn(),
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
    useRoute: () => ({ name: "TestSreen" }),
  };
});

describe("HeaderWithLogo", () => {
  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      name: "TestSreen",
    });
  }),
    it("should render correctly with LTR", () => {
      (i18n.isRTL as jest.Mock).mockReturnValueOnce(false);
      const component = wrapWithProvidersAndRender({
        Component: HeaderWithLogo,
      });
      expect(component).toMatchSnapshot();
    });

  it("should render correctly with RTL", () => {
    (i18n.isRTL as jest.Mock).mockReturnValueOnce(true);
    const component = wrapWithProvidersAndRender({ Component: HeaderWithLogo });
    expect(component).toMatchSnapshot();
  });
});
