import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { LanguageChoiceScreen } from "../LanguageChoiceScreen";
import { initialRootStateFactory } from "../../services/redux/reducers";
import { fireEvent, act } from "react-native-testing-library";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import { useTranslationWithRTL } from "../../hooks/useTranslationWithRTL";

jest.mock("../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
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

describe("LanguageChoiceScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const changeLanguage = jest.fn();
    (useTranslationWithRTL as jest.Mock).mockReturnValueOnce({
      i18n: { changeLanguage },
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
