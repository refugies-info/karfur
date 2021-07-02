import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { fireEvent, act } from "react-native-testing-library";
import { ProfilScreen } from "../ProfilScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

describe("Profil screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when no data in store", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
    const ButtonLangue = component.getByTestId(
      "test-profil-button-globe-2-outline"
    );

    act(() => {
      fireEvent.press(ButtonLangue);
    });
    expect(navigation.navigate).toHaveBeenCalledWith("LangueProfilScreen");
  });

  it("should navigate to correct screen loc", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonLoc = component.getByTestId("test-profil-button-pin-outline");

    act(() => {
      fireEvent.press(ButtonLoc);
    });
    expect(navigation.navigate).toHaveBeenCalledWith("CityProfilScreen");
  });

  it("should navigate to correct screen age", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonAge = component.getByTestId(
      "test-profil-button-calendar-outline"
    );

    act(() => {
      fireEvent.press(ButtonAge);
    });
    expect(navigation.navigate).toHaveBeenCalledWith("AgeProfilScreen");
  });

  it("should navigate to correct screen french", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const ButtonFrenchLevel = component.getByTestId(
      "test-profil-button-message-circle-outline"
    );

    act(() => {
      fireEvent.press(ButtonFrenchLevel);
    });
    expect(navigation.navigate).toHaveBeenCalledWith("FrenchLevelProfilScreen");
  });

  it("should render correctly when data in store", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          age: "0 à 17 ans",
          frenchLevel: "Je commence à apprendre",
          city: "Paris",
        },
      },
      compProps: { navigation },
    });
    expect(component).toMatchSnapshot();
  });

  it("should toggle modale when delete daat", () => {
    const navigation = { navigate: jest.fn() };
    const component = wrapWithProvidersAndRender({
      Component: ProfilScreen,
      reduxState: {
        ...initialRootStateFactory(),
      },
      compProps: { navigation },
    });
    const Button = component.getByTestId("test-delete-data");

    act(() => {
      fireEvent.press(Button);
    });
    expect(component).toMatchSnapshot();
  });
});
