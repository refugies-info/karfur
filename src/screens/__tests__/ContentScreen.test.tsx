import React from "react";
import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { ContentScreen } from "../ContentScreen";
import { fireEvent, act } from "react-native-testing-library";
import { initialRootStateFactory } from "../../services/redux/reducers";
import { selectedContent } from "../../jest/__fixtures__/selectedContent";
import { initialUserState } from "../../services/redux/User/user.reducer";
import { mockedThemesData } from "../../jest/__fixtures__/themes";
import { useRoute } from "@react-navigation/native";

const theme = mockedThemesData[0];

jest.useFakeTimers();
jest.mock("../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

jest.mock("../../libs/getImageUri", () => ({
  getImageUri: jest.fn().mockImplementation((arg1) => arg1),
}));

jest.mock("../../utils/logEvent", () => ({
  logEventInFirebase: jest.fn(),
}));

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  const MockMapView = (props: any) => {
    return <View>{props.children}</View>;
  };
  const MockMarker = (props: any) => {
    return <View>{props.children}</View>;
  };
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock("@gorhom/bottom-sheet", () => {
  const RN = require("react-native");
  const { MockBottomSheet } = require("../../jest/__mocks__/MockBottomSheet");

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

describe("ContentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({ routeName: "ContentScreen" });
  });

  it("should render correctly", async () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: {
        contentId: "",
        theme: theme,
      },
    };
    const component = wrapWithProvidersAndRender({
      Component: ContentScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          currentLanguagei18nCode: "fr",
          favorites: [],
        },
        selectedContent: {
          fr: selectedContent,
          en: null,
          ar: null,
          ps: null,
          fa: null,
          ti: null,
          ru: null,
          uk: null,
        },
      },
      compProps: { navigation, route },
    });
    expect(component).toMatchSnapshot();
  });

  it("should toggle map modal", async () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: {
        contentId: "",
        theme: theme,
      },
    };
    const component = wrapWithProvidersAndRender({
      Component: ContentScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          currentLanguagei18nCode: "fr",
          favorites: [],
        },
        selectedContent: {
          fr: selectedContent,
          en: null,
          ar: null,
          ps: null,
          fa: null,
          ti: null,
          ru: null,
          uk: null,
        },
      },
      compProps: { navigation, route },
    });

    const Button = component.getByTestId("test-button-map");
    act(() => {
      fireEvent.press(Button);
    });
    expect(component).toMatchSnapshot();
  });
});
