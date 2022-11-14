import { SearchResultsScreen } from "../SearchResultsScreen";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { mockedThemesData } from "../../../jest/__fixtures__/themes";

jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

describe("Search results screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const component = wrapWithProvidersAndRender({
      Component: SearchResultsScreen,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        themes: mockedThemesData,
      },
    });
    expect(component).toMatchSnapshot();
  });
});
