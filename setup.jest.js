/* eslint-disable no-console */
jest.useFakeTimers();
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
// jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter.js", () => {
//   const { EventEmitter } = require("events");
//   return EventEmitter;
// });
// jest.mock("expo-speech", () => {});

jest.mock("react-native-blob-util", () => {});

jest.mock("@react-native-firebase/analytics", () => {
  return () => ({
    logEvent: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
  });
});

jest.mock("@react-native-firebase/crashlytics", () => {
  return () => ({
    recordError: jest.fn(),
  });
});

jest.mock("@gorhom/bottom-sheet", () => {
  const RN = require("react-native");
  const { MockBottomSheet } = require("./src/jest/__mocks__/MockBottomSheet");

  return {
    __esModule: true,
    default: MockBottomSheet,
    BottomSheetView: RN.View,
    useBottomSheetDynamicSnapPoints: jest.fn().mockReturnValue({
      animatedHandleHeight: 0,
      animatedSnapPoints: 0,
      animatedContentHeight: 0,
      handleContentLayout: jest.fn(),
    }),
  };
});

jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
  useNavigation: jest.fn().mockImplementation(() => ({
    goBack: jest.fn().mockImplementation(() => () => console.log("Go back")),
    navigate: jest
      .fn()
      .mockImplementation(() => (to) => console.log("Navigation to " + to)),
  })),
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: "data" }),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { Max: 7 },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
