import { useRoute } from "@react-navigation/native";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { AboutScreen } from "../AboutScreen";

jest.useFakeTimers();
jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

describe("About screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "AboutScreen",
    });
  });

  it("should render correctly", async () => {
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
