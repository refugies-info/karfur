import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { PrivacyPolicyScreen } from "../PrivacyPolicyScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

describe("PrivacyPolicy screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: PrivacyPolicyScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
  });
});
