// Import built-in Jest matchers
import "@testing-library/jest-dom";
import "@testing-library/react-native/extend-expect";

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

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));
