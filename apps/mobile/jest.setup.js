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

// Targeted mock: stub out react-native-svg's fetchData to avoid URL parsing/fetch in Node
jest.mock("react-native-svg/src/utils/fetchData", () => {
  const makeResponse = async () => ({ xml: '<svg xmlns="http://www.w3.org/2000/svg" />' });
  const fetchText = async () => '<svg xmlns="http://www.w3.org/2000/svg" />';
  return {
    __esModule: true,
    default: makeResponse,
    fetchUriData: makeResponse,
    fetchText,
  };
});

// Also mock potential alternate paths used by compiled builds or resolvers
jest.mock("react-native-svg/src/utils/fetchData.ts", () => {
  const makeResponse = async () => ({ xml: '<svg xmlns="http://www.w3.org/2000/svg" />' });
  const fetchText = async () => '<svg xmlns="http://www.w3.org/2000/svg" />';
  return {
    __esModule: true,
    default: makeResponse,
    fetchUriData: makeResponse,
    fetchText,
  };
});

jest.mock("react-native-svg/lib/commonjs/utils/fetchData", () => {
  const makeResponse = async () => ({ xml: '<svg xmlns="http://www.w3.org/2000/svg" />' });
  const fetchText = async () => '<svg xmlns="http://www.w3.org/2000/svg" />';
  return {
    __esModule: true,
    default: makeResponse,
    fetchUriData: makeResponse,
    fetchText,
  };
});

// Defensive: mock global fetch for .svg URIs so any stray fetch still returns a valid SVG
(() => {
  const makeSvg = '<svg xmlns="http://www.w3.org/2000/svg" />';
  const fetchImpl = async (input) => {
    const url = typeof input === "string" ? input : input?.url;
    if (typeof url === "string" && url.endsWith(".svg")) {
      return new Response(makeSvg, {
        status: 200,
        headers: { "Content-Type": "image/svg+xml" },
      });
    }
    return new Response("", { status: 404 });
  };

  if (typeof global.fetch === "function") {
    try {
      jest.spyOn(global, "fetch").mockImplementation(fetchImpl);
    } catch (_) {
      // fallback if spy fails
      global.fetch = jest.fn(fetchImpl);
    }
  } else {
    global.fetch = jest.fn(fetchImpl);
  }
})();

// Filter known act() warning noise from react-native-svg's SvgUri to stabilize CI logs.
// We only suppress the specific warning string; other errors still surface.
(() => {
  const origError = console.error;
  const svgActWarning = "Warning: An update to SvgUri inside a test was not wrapped in act(...).";
  console.error = (...args) => {
    const msg = args?.[0];
    if (typeof msg === "string" && msg.includes(svgActWarning)) {
      return; // ignore this specific noisy warning
    }
    return origError(...args);
  };
})();

// Make SvgUri sync-only to eliminate async setState (no act warnings); keep other exports intact
jest.mock("react-native-svg", () => {
  const actual = jest.requireActual("react-native-svg");
  const React = require("react");
  const { View } = require("react-native");
  const SvgUri = (props) => React.createElement(View, props, props.children);
  return {
    ...actual,
    SvgUri,
    default: actual.default,
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
