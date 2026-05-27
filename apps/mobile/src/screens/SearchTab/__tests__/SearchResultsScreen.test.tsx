import { initialRootStateFactory } from "~/services/redux/reducers";
import { mockedThemesData } from "../../../jest/__fixtures__/themes";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { SearchResultsScreen } from "../SearchResultsScreen";

jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

// Mock Algolia client
jest.mock("algoliasearch/lite", () => ({
  liteClient: jest.fn().mockReturnValue({
    search: jest.fn().mockResolvedValue({ results: [{ hits: [] }] }),
  }),
}));

jest.mock("react-instantsearch-core", () => {
  const React = require("react");

  return {
    Configure: () => null,
    InstantSearch: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useInfiniteHits: jest.fn(() => ({
      hits: [],
      isLastPage: true,
      showMore: jest.fn(),
    })),
    useSearchBox: jest.fn(() => ({
      query: "",
      refine: jest.fn(),
    })),
  };
});

describe("Search results screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
    };

    const component = wrapWithProvidersAndRender({
      Component: SearchResultsScreen,
      compProps: { navigation: mockNavigation },
      reduxState: {
        ...initialRootStateFactory(),
        themes: mockedThemesData,
      },
    });

    expect(component).toMatchSnapshot();
  });
});
