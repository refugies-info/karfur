import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { LanguageChoiceScreen } from "../LanguageChoiceScreen";
import { initialRootStateFactory } from "../../services/redux/reducers";
import { fetchLanguagesActionCreator } from "../../services/redux/Languages/languages.actions";
import { fireEvent, act } from "react-native-testing-library";
import { saveSelectedLanguageActionCreator } from "../../services/redux/User/user.actions";
import i18n from "../../services/i18n";

jest.mock("../../services/redux/Languages/languages.actions", () => {
  const actions = jest.requireActual(
    "../../services/redux/Languages/languages.actions"
  );
  return {
    fetchLanguagesActionCreator: jest.fn(actions.fetchLanguagesActionCreator),
  };
});

jest.mock("../../services/i18n", () => ({
  __esModule: true, // this property makes it work
  default: { changeLanguage: jest.fn(), isRTL: jest.fn() },
}));

jest.mock("../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual("../../services/redux/User/user.actions");
  return {
    saveSelectedLanguageActionCreator: jest.fn(
      actions.saveSelectedLanguageActionCreator
    ),
  };
});

const languageData = [
  {
    _id: "5ce57c969aadae8734c7aedd",
    avancementTrad: undefined,
    i18nCode: "fr",
    langueFr: "Français",
  },
  {
    _id: "5ce57c969aadae8734c7aee0",
    avancementTrad: 0.6276595744680851,
    i18nCode: "ps",
    langueFr: "Pachto",
  },
  {
    _id: "5ce57c969aadae8734c7aee8",
    avancementTrad: 0.5106382978723404,
    i18nCode: "fa",
    langueFr: "Persan/Dari",
  },
  {
    _id: "5ce57c969aadae8734c7aedf",
    avancementTrad: 0.7056737588652482,
    i18nCode: "en",
    langueFr: "Anglais",
  },
  {
    _id: "5db9684e5cdcfc00165352be",
    avancementTrad: 0.46099290780141844,
    i18nCode: "ti-ER",
    langueFr: "Tigrinya",
  },
  {
    _id: "5ce57c969aadae8734c7aee2",
    avancementTrad: 0.8439716312056738,
    i18nCode: "ru",
    langueFr: "Russe",
  },
  {
    _id: "5ce57c969aadae8734c7aede",
    avancementTrad: 0.9609929078014184,
    i18nCode: "ar",
    langueFr: "Arabe",
  },
];
describe("LanguageChoiceScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const component = wrapWithProvidersAndRender({
      Component: LanguageChoiceScreen,
      reduxState: {
        ...initialRootStateFactory(),
        languages: { availableLanguages: languageData },
      },
    });
    expect(fetchLanguagesActionCreator).toHaveBeenCalledWith();
    expect(component).toMatchSnapshot();
    const Button = component.getByTestId("test-language-button-Anglais");
    act(() => {
      fireEvent.press(Button);
    });
    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
    expect(saveSelectedLanguageActionCreator).toHaveBeenCalledWith("en");
  });
});
