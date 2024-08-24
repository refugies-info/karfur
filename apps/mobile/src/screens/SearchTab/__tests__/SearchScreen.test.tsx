import { SearchScreen } from "../SearchScreen";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { mockedThemesData } from "../../../jest/__fixtures__/themes";
import { useRoute } from "@react-navigation/core";
jest.mock("@react-navigation/core");

jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../../utils/logEvent", () => ({
  logEventInFirebase: jest.fn(),
}));

describe("Search Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "LanguageChoiceScreen",
    });
  });

  it("should render correctly", async () => {
    const component = wrapWithProvidersAndRender({
      Component: SearchScreen,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        themes: mockedThemesData,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
