/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
/* eslint-disable no-undef */

// Import built-in Jest matchers
import "@testing-library/react-native/extend-expect";

require("react-native-reanimated").setUpTests();

jest.useFakeTimers();

// jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter.js", () => {
//   const { EventEmitter } = require("events");
//   return EventEmitter;
// });
// jest.mock("expo-speech", () => {});

jest.mock("react-native-blob-util", () => {
  return () => ({});
});

jest.mock("uuid", () => {
  return () => ({});
});

jest.mock("search-insights", () => {
  return () => ({});
});

// jest.mock("@react-native-firebase/app", () => {
//   return () => ({
//     onNotification: jest.fn(),
//     onNotificationDisplayed: jest.fn(),
//   });
// });

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

// jest.mock("@gorhom/bottom-sheet", () => {
//   const RN = require("react-native");
//   const { MockBottomSheet } = require("./src/jest/__mocks__/MockBottomSheet");

//   return {
//     __esModule: true,
//     default: MockBottomSheet,
//     BottomSheetView: RN.View,
//     useBottomSheetDynamicSnapPoints: jest.fn().mockReturnValue({
//       animatedHandleHeight: 0,
//       animatedSnapPoints: 0,
//       animatedContentHeight: 0,
//       handleContentLayout: jest.fn(),
//     }),
//   };
// });

jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
  useNavigation: jest.fn().mockImplementation(() => ({
    goBack: jest.fn().mockImplementation(() => () => console.log("Go back")),
    navigate: jest.fn().mockImplementation(() => (to) => console.log("Navigation to " + to)),
  })),
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: "data" }),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { Max: 7 },
  PermissionStatus: {
    GRANTED: "granted",
    UNDETERMINED: "undetermined",
    DENIED: "denied",
  },
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock all SVG imports
jest.mock("*.svg", () => "SvgMock");

jest.mock("react-native-reanimated", () => {
  const View = require("react-native").View;
  const createAnimatedComponent = (Component) => Component;

  return {
    ...jest.requireActual("react-native-reanimated"),
    useAnimatedStyle: jest.fn().mockImplementation(() => ({ style: {} })),
    createAnimatedComponent,
    default: {
      View,
      createAnimatedComponent,
    },
    Animated: {
      View,
      createAnimatedComponent,
    },
    View,
  };
});


// Mock react-native-svg to avoid network fetches in SvgUri during tests
// SvgUri tries to fetch() the provided uri, which fails in Node (CI) when given
// a non-absolute path like "/images/app/logement.svg". We stub the module so
// components render as simple Views and never invoke fetch.
// Targeted mock: stub out react-native-svg's fetchData to avoid URL parsing/fetch in Node
jest.mock("react-native-svg/src/utils/fetchData", () => {
  const makeResponse = async () => ({ xml: '<svg xmlns="http://www.w3.org/2000/svg" />' });
  return {
    __esModule: true,
    default: makeResponse,
    fetchUriData: makeResponse,
  };
});

jest.mock("@gorhom/bottom-sheet", () => ({
  __esModule: true,
  default: "BottomSheet",
  BottomSheetView: "BottomSheetView",
  useBottomSheetDynamicSnapPoints: jest.fn().mockReturnValue({
    animatedHandleHeight: { value: 0 },
    animatedSnapPoints: [0],
    animatedContentHeight: { value: 0 },
    handleContentLayout: jest.fn(),
  }),
}));
