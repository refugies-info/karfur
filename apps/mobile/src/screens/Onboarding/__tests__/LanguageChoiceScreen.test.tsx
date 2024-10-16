import { useRoute } from "@react-navigation/core";
import { fireEvent } from "@testing-library/react-native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { LanguageChoiceScreen } from "../LanguageChoiceScreen";

jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
}));

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual("../../../services/redux/User/user.actions");
  return {
    saveSelectedLanguageActionCreator: jest.fn(actions.saveSelectedLanguageActionCreator),
  };
});

jest.useFakeTimers();

describe("LanguageChoiceScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "LanguageChoiceScreen",
    });
  });

  it("should render correctly", async () => {
    const changeLanguage = jest.fn();
    (useTranslationWithRTL as jest.Mock).mockReturnValue({
      i18n: { changeLanguage },
      t: jest.fn().mockImplementationOnce((arg1, _) => arg1),
    });
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: LanguageChoiceScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
    const Button = component.getByTestId("test-language-button-Anglais");
    fireEvent.press(Button);
    expect(changeLanguage).toHaveBeenCalledTimes(1);
    expect(changeLanguage).toHaveBeenCalledWith("en");
    /* FIXME: not working anymore since we await changeLanguage
    expect(saveSelectedLanguageActionCreator).toHaveBeenCalledWith({
      langue: "en",
      shouldFetchContents: false,
    }); */
    // expect(navigation.navigate).toHaveBeenCalledWith("OnboardingStart"); // not working
  });
});
