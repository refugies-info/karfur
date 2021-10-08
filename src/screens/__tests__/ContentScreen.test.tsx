import { wrapWithProvidersAndRender } from "../../jest/wrapWithProvidersAndRender";
import { ContentScreen } from "../ContentScreen";
import { fireEvent, act } from "react-native-testing-library";
import { initialRootStateFactory } from "../../services/redux/reducers";
import { selectedContent } from "../../jest/__fixtures__/selectedContent";

jest.mock("../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ insets: { bottom: 0 } }),
}))

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

jest.mock("react-native-portalize", () => {
  const { View } = jest.requireActual("react-native");
  return {
    Portal: View,
  };
});

describe("ContentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: {
        contentId: "",
        tagName: "",
        tagDarkColor: "#3D2884",
        tagLightColor: "#705FA4",
        tagVeryLightColor: "#EFE8F4",
      },
    };
    const component = wrapWithProvidersAndRender({
      Component: ContentScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          currentLanguagei18nCode: "fr",
        },
        selectedContent: {
          fr: selectedContent,
          en: null,
          ar: null,
          ps: null,
          fa: null,
          "ti-ER": null,
          ru: null,
        },
      },
      compProps: { navigation, route },
    });
    expect(component).toMatchSnapshot();
  });

  it("should toggle map modal", () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: {
        contentId: "",
        tagName: "",
        tagDarkColor: "#3D2884",
        tagLightColor: "#705FA4",
        tagVeryLightColor: "#EFE8F4",
      },
    };
    const component = wrapWithProvidersAndRender({
      Component: ContentScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          currentLanguagei18nCode: "fr",
        },
        selectedContent: {
          fr: selectedContent,
          en: null,
          ar: null,
          ps: null,
          fa: null,
          "ti-ER": null,
          ru: null,
        },
      },
      compProps: { navigation, route },
    });

    const Button = component.getByTestId("test-custom-button-Voir la carte");
    act(() => {
      fireEvent.press(Button);
    });
    expect(component).toMatchSnapshot();
  });
});
