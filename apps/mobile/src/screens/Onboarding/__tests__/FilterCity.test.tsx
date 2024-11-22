import { useNavigation } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";
import { wrapWithProvidersAndRender } from "~/jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "~/services/redux/reducers";
import {
  removeUserLocalizedWarningHiddenActionCreator,
  removeUserLocationActionCreator,
  saveUserLocationActionCreator,
} from "~/services/redux/User/user.actions";
import { FilterCity } from "../FilterCity";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();

jest.mock("~/services/redux/User/user.actions", () => ({
  removeUserLocalizedWarningHiddenActionCreator: jest.fn(() => ({ type: "REMOVE_USER_LOCALIZED_WARNING_HIDDEN" })),
  removeUserLocationActionCreator: jest.fn(() => ({ type: "REMOVE_USER_LOCATION" })),
  saveUserLocationActionCreator: jest.fn((payload) => ({ type: "SAVE_USER_LOCATION", payload })),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

describe("FilterCity", () => {
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
    initialState.user = {
      ...initialState.user,
      city: "Paris",
      department: "75",
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    expect(getByTestId("test-filter-city-component")).toBeTruthy();
  });

  it("handles city and department selection", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      city: "",
      department: "",
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    // Find a city choice button and press it
    const parisButton = getByTestId("test-city-choice-paris");
    fireEvent.press(parisButton);

    const nextButton = getByTestId("test-next-button");
    expect(nextButton.props.disabled).toBeFalsy();
  });

  it("navigates to next screen on validate with city and department selected", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      city: "",
      department: "",
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    // Select a city
    const parisButton = getByTestId("test-city-choice-paris");
    fireEvent.press(parisButton);

    // Press next
    const nextButton = getByTestId("test-next-button");
    fireEvent.press(nextButton);

    expect(mockDispatch).toHaveBeenCalledWith(removeUserLocalizedWarningHiddenActionCreator());
    expect(mockDispatch).toHaveBeenCalledWith(
      saveUserLocationActionCreator({
        city: "Paris",
        dep: "Paris",
        shouldFetchContents: false,
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("FilterAge");
  });

  it("handles skip functionality", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      city: "Paris",
      department: "75",
    };

    const { getByText } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const skipButton = getByText("onboarding_screens.skip");
    fireEvent.press(skipButton);

    expect(mockDispatch).toHaveBeenCalledWith(removeUserLocationActionCreator(false));
    expect(mockNavigate).toHaveBeenCalledWith("FilterAge");
  });

  it("navigates to previous screen", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      city: "Paris",
      department: "75",
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const backButton = getByTestId("test-prev-button");
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("OnboardingSteps");
  });

  it("disables next button when no department is selected", () => {
    const initialState = initialRootStateFactory();
    initialState.user = {
      ...initialState.user,
      city: "",
      department: "",
    };

    const { getByTestId } = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: defaultProps,
      reduxState: initialState,
    });

    const nextButton = getByTestId("test-next-button");
    expect(nextButton).toBeDisabled();
  });
});
