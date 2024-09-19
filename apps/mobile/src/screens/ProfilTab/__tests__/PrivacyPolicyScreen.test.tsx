import { useRoute } from "@react-navigation/native";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { PrivacyPolicyScreen } from "../PrivacyPolicyScreen";

jest.useFakeTimers();
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
    (useRoute as jest.Mock).mockReturnValue({
      name: "PrivacyPolicyScreen",
    });
  });

  it("should render correctly", async () => {
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
