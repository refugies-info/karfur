import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { LanguageChoiceScreen } from "../LanguageChoiceScreen";
import { initialRootStateFactory } from "../../services/redux/reducers";
import { fireEvent, act } from "react-native-testing-library";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

jest.mock("../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual("../../services/redux/User/user.actions");
  return {
    saveSelectedLanguageActionCreator: jest.fn(
      actions.saveSelectedLanguageActionCreator
    ),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { SafeAreaView } = jest.requireActual("react-native-safe-area-context");

  return {
    useSafeAreaInsets: () => ({ insets: { bottom: 0 } }),
    SafeAreaView,
  };
});

describe("LanguageChoiceScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const changeLanguage = jest.fn();
    (useTranslationWithRTL as jest.Mock).mockReturnValueOnce({
      i18n: { changeLanguage },
      t: jest.fn().mockImplementationOnce((arg1, _) => arg1),
    });
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: LanguageChoiceScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
    const Button = component.getByTestId("test-language-button-Anglais");
    act(() => {
      fireEvent.press(Button);
    });
    expect(changeLanguage).toHaveBeenCalledWith("en");
    expect(saveSelectedLanguageActionCreator).toHaveBeenCalledWith({
      langue: "en",
      shouldFetchContents: false,
    });
    expect(navigation.navigate).toHaveBeenCalledWith("OnboardingStart");
  });
});
