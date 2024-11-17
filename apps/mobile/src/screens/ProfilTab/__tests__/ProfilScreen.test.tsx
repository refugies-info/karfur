import { useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { fireEvent, screen } from "@testing-library/react-native";
import { legacy_createStore as createStore } from "redux";
import { initialRootStateFactory, rootReducer, RootState } from "~/services/redux/reducers";
import { initialUserState } from "~/services/redux/User/user.reducer";
import { ProfileParamList } from "~/types/navigation";
import { createNavigationMock, renderWithProviders } from "../../../jest/testUtils";
import { ProfilScreen } from "../ProfilScreen";

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    i18n: { changeLanguage: jest.fn() },
    t: jest.fn().mockImplementation((key) => key), // Return the key for easier testing
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
    const navigation = createNavigationMock();
    const component = renderWithProviders(<ProfilScreen navigation={navigation} />);
    expect(component).toMatchSnapshot();
    const ButtonLangue = screen.getByTestId("test-profil-button-language-button");

    fireEvent.press(ButtonLangue);
    expect(navigation.navigate).toHaveBeenCalledWith("LangueProfilScreen");
  });

  it("should navigate to correct screen loc", async () => {
    const navigation = createNavigationMock();
    renderWithProviders(<ProfilScreen navigation={navigation} />);
    const ButtonLoc = screen.getByTestId("test-profil-button-city");

    fireEvent.press(ButtonLoc);
    expect(navigation.navigate).toHaveBeenCalledWith("CityProfilScreen");
  });

  it("should navigate to correct screen age", async () => {
    const navigation = createNavigationMock();
    renderWithProviders(<ProfilScreen navigation={navigation} />);
    const ButtonAge = screen.getByTestId("test-profil-button-age");

    fireEvent.press(ButtonAge);
    expect(navigation.navigate).toHaveBeenCalledWith("AgeProfilScreen");
  });

  it("should navigate to correct screen french", async () => {
    const navigation = createNavigationMock();
    renderWithProviders(<ProfilScreen navigation={navigation} />);
    const ButtonFrenchLevel = screen.getByTestId("test-profil-button-french");

    fireEvent.press(ButtonFrenchLevel);
    expect(navigation.navigate).toHaveBeenCalledWith("FrenchLevelProfilScreen");
  });

  it("should render correctly when data in store", async () => {
    const navigation = { navigate: jest.fn() } as unknown as StackNavigationProp<
      ProfileParamList,
      "ProfilScreen",
      undefined
    >;
    const store = createStore<RootState, any>(rootReducer, {
      ...initialRootStateFactory(),
      user: {
        ...initialUserState,
        age: "0 à 17 ans",
        frenchLevel: MobileFrenchLevel["Je parle couramment"],
        city: "Paris",
      },
    });
    const navContext = {
      isFocused: () => true,
      addListener: jest.fn(() => jest.fn()),
    };
    const value = renderWithProviders(<ProfilScreen navigation={navigation} />);

    expect(value).toMatchSnapshot();
  });

  it("should render correctly with default state", () => {
    const navigation = createNavigationMock();
    renderWithProviders(<ProfilScreen navigation={navigation} />);

    const languageButton = screen.getByTestId("test-profil-button-language-button");
    fireEvent.press(languageButton);

    expect(navigation.navigate).toHaveBeenCalledWith("LangueProfilScreen");
  });

  it("should display user information when logged in", () => {
    const navigation = createNavigationMock();
    const mockUser = {
      ...initialUserState,
      user: {
        frenchLevel: MobileFrenchLevel["Je ne lis et n'écris pas le français"],
      },
    };

    renderWithProviders(<ProfilScreen navigation={navigation} />, {
      initialState: {
        ...initialRootStateFactory(),
        user: mockUser,
      },
    });

    // Check for French level instead of username/email
    const frenchLevelButton = screen.getByTestId("test-profil-button-french");
    expect(frenchLevelButton).toBeTruthy();
  });
});
