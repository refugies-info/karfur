import { useRoute } from "@react-navigation/core";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { fireEvent } from "@testing-library/react-native";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { initialUserState } from "../../../services/redux/User/user.reducer";
import { ProfilScreen } from "../ProfilScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
    isRTL: false,
  }),
}));

jest.mock("../../../utils/logEvent", () => ({
  logEventInFirebase: jest.fn(),
}));

jest.useFakeTimers();

describe("Profil screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "LanguageChoiceScreen",
    });
  });

  it("should render correctly when no data in store", async () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
    const ButtonLangue = component.getByTestId("test-profil-button-language-button");

    fireEvent.press(ButtonLangue);
    expect(navigation.navigate).toHaveBeenCalledWith("LangueProfilScreen");
  });

  it("should navigate to correct screen loc", async () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonLoc = component.getByTestId("test-profil-button-city");

    fireEvent.press(ButtonLoc);
    expect(navigation.navigate).toHaveBeenCalledWith("CityProfilScreen");
  });

  it("should navigate to correct screen age", async () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonAge = component.getByTestId("test-profil-button-age");

    fireEvent.press(ButtonAge);
    expect(navigation.navigate).toHaveBeenCalledWith("AgeProfilScreen");
  });

  it("should navigate to correct screen french", async () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonFrenchLevel = component.getByTestId("test-profil-button-french");

    fireEvent.press(ButtonFrenchLevel);
    expect(navigation.navigate).toHaveBeenCalledWith("FrenchLevelProfilScreen");
  });

  it("should render correctly when data in store", async () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          age: "0 à 17 ans",
          frenchLevel: MobileFrenchLevel["Je parle couramment"],
          city: "Paris",
        },
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
  });
});
