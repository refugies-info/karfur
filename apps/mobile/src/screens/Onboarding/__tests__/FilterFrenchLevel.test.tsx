import { useNavigation } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";
import { frenchLevelFilters } from "~/data/filtersData";
import { wrapWithProvidersAndRender } from "~/jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "~/services/redux/reducers";
import {
  removeUserFrenchLevelActionCreator,
  saveUserFrenchLevelActionCreator,
} from "~/services/redux/User/user.actions";
import { FilterFrenchLevel } from "../FilterFrenchLevel";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("~/services/redux/User/user.actions", () => ({
  removeUserFrenchLevelActionCreator: jest.fn(() => ({ type: "REMOVE_USER_FRENCH_LEVEL" })),
  saveUserFrenchLevelActionCreator: jest.fn((payload) => ({ type: "SAVE_USER_FRENCH_LEVEL", payload })),
}));

describe("FilterFrenchLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  const defaultProps = {
    navigation: {
      navigate: mockNavigate,
    },
  };

  it("renders correctly", () => {
    const initialState = initialRootStateFactory();
    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    expect(getByText("onboarding_screens.french_level")).toBeTruthy();
  });

  it("handles french level selection", () => {
    const initialState = initialRootStateFactory();
    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const frenchLevelButton = getByTestId("test-filter-french_level_0");
    fireEvent.press(frenchLevelButton);

    const nextButton = getByTestId("test-next-button");
    expect(nextButton.props.disabled).toBeFalsy();
  });

  it("toggles french level selection when pressing the same level twice", () => {
    const initialState = initialRootStateFactory();
    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const frenchLevelButton = getByTestId("test-filter-french_level_0");
    fireEvent.press(frenchLevelButton);
    fireEvent.press(frenchLevelButton);

    const nextButton = getByTestId("test-next-button");
    expect(nextButton).toBeDisabled();
  });

  it("navigates to next screen and saves french level on validate", () => {
    const initialState = initialRootStateFactory();
    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const frenchLevelButton = getByTestId("test-filter-french_level_0");
    fireEvent.press(frenchLevelButton);

    const nextButton = getByTestId("test-next-button");
    fireEvent.press(nextButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      saveUserFrenchLevelActionCreator({
        frenchLevel: frenchLevelFilters[0].key,
        shouldFetchContents: false,
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("ActivateNotificationsScreen");
  });

  it("navigates to next screen and removes french level on skip", () => {
    const initialState = initialRootStateFactory();
    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const skipButton = getByText("onboarding_screens.skip");
    fireEvent.press(skipButton);

    expect(mockDispatch).toHaveBeenCalledWith(removeUserFrenchLevelActionCreator(false));
    expect(mockNavigate).toHaveBeenCalledWith("ActivateNotificationsScreen");
  });

  it("navigates to previous screen when back button is pressed", () => {
    const initialState = initialRootStateFactory();
    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const backButton = getByTestId("test-prev-button");
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("FilterAge");
  });

  it("loads existing french level from redux state", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      frenchLevel: frenchLevelFilters[0].key,
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const nextButton = getByTestId("test-next-button");
    expect(nextButton.props.disabled).toBeFalsy();
  });
});
