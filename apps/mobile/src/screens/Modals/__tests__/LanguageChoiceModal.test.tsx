import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { mockedLanguageData } from "../../../jest/__fixtures__/languages";
import { LanguageChoiceModal } from "../LanguageChoiceModal";
import { useTranslationWithRTL } from "../../../hooks/useTranslationWithRTL";

jest.mock("../../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual(
    "../../../services/redux/User/user.actions"
  );
  return {
    saveSelectedLanguageActionCreator: jest.fn(
      actions.saveSelectedLanguageActionCreator
    ),
  };
});

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn(),
  }),
}));

describe("LanguageChoiceModal", () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });

  it("should render correctly", async () => {
    const changeLanguage = jest.fn();
    (useTranslationWithRTL as jest.Mock).mockReturnValueOnce({
      i18n: { changeLanguage },
      t: jest.fn().mockImplementationOnce((arg1, _) => arg1),
    });
    const toggleModal = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: LanguageChoiceModal,
      reduxState: {
        ...initialRootStateFactory(),
        languages: { availableLanguages: mockedLanguageData },
      },
      compProps: { toggleModal },
    });
    expect(component).toMatchSnapshot();
  });
});
