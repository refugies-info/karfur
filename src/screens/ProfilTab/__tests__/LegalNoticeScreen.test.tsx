import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { LegalNoticeScreen } from "../LegalNoticeScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

describe("LegalNotice screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: LegalNoticeScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
  });
});
