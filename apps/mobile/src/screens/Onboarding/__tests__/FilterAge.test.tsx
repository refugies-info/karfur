import { useNavigation } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { wrapWithProvidersAndRender } from "~/jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { FilterAge } from "../FilterAge";

// Mock Firebase modules
jest.mock("@react-native-firebase/analytics", () => ({
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(),
  }),
}));

jest.mock("@react-native-firebase/crashlytics", () => ({
  __esModule: true,
  default: () => ({
    log: jest.fn(),
    recordError: jest.fn(),
  }),
}));

// Mock Expo modules
jest.mock("expo-updates", () => ({
  __esModule: true,
  default: {
    checkForUpdateAsync: jest.fn(),
    fetchUpdateAsync: jest.fn(),
    reloadAsync: jest.fn(),
  },
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        environment: "test",
      },
    },
  },
}));

jest.mock("expo-device", () => ({
  __esModule: true,
  isDevice: jest.fn(() => true),
}));

jest.mock("expo-modules-core", () => ({
  PermissionStatus: {
    GRANTED: "granted",
    DENIED: "denied",
  },
  requireNativeViewManager: jest.fn(),
  requireNativeModule: jest.fn(() => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  })),
  requireOptionalNativeModule: jest.fn(() => null),
}));

jest.mock("expo-notifications", () => ({
  getExpoPushTokenAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  AndroidImportance: {
    MAX: 5,
  },
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("expo-linking", () => ({
  createURL: jest.fn(),
  parse: jest.fn(),
  parseInitialURLAsync: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
    setAudioModeAsync: jest.fn(),
  },
  AVPlaybackStatus: {
    Success: jest.fn(),
  },
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(),
}));

// Mock React Native modules
jest.mock("@react-native-community/hooks", () => ({
  useAppState: jest.fn(() => ({ appState: "active" })),
}));

jest.mock("react-native-blob-util", () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(),
    config: jest.fn(),
    fs: {
      dirs: {
        DocumentDir: "/mock/document/dir",
        CacheDir: "/mock/cache/dir",
      },
    },
  },
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("FilterAge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(mockDispatch);
    (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation(mockSelector);
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
