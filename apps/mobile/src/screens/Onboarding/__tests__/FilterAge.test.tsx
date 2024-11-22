import { useNavigation } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";
import { wrapWithProvidersAndRender } from "~/jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { FilterAge } from "../FilterAge";

const mockNavigate = jest.fn();

describe("FilterAge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  const defaultProps = {
    navigation: {
      navigate: mockNavigate,
    },
  };

  it("renders correctly", () => {
    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
    });

    expect(getByText("onboarding_screens.age")).toBeTruthy();
    expect(getByText("onboarding_screens.help_2")).toBeTruthy();
  });

  it("handles age selection correctly", () => {
    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
    });

    const ageButton = getByText("filters.age_10_17");
    fireEvent.press(ageButton);

    // Test deselection
    fireEvent.press(ageButton);
  });

  it("navigates to next screen on validate with age selected", () => {
    const { getByText, getByTestId } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
    });

    const ageButton = getByText("filters.age_10_17");
    fireEvent.press(ageButton);

    const nextButton = getByTestId("test-next-button");
    fireEvent.press(nextButton);

    expect(mockNavigate).toHaveBeenCalledWith("FilterFrenchLevel");
  });

  it("handles skip functionality", () => {
    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
    });

    const skipButton = getByText("onboarding_screens.skip");
    fireEvent.press(skipButton);

    expect(mockNavigate).toHaveBeenCalledWith("FilterFrenchLevel");
  });

  it("loads user age from redux state", () => {
    const initialState = initialRootStateFactory();
    initialState.user.age = "0 à 17 ans";

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const ageButton = getByTestId("test-filter-age_10_17");
    expect(ageButton).toBeTruthy();
  });

  it("navigates to previous screen", () => {
    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: defaultProps,
    });

    const backButton = getByTestId("test-prev-button");
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("FilterCity");
  });
});
