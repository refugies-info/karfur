import { FilterFrenchLevel } from "../FilterFrenchLevel";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "react-native-testing-library";
import { saveUserFrenchLevelActionCreator } from "../../../services/redux/User/user.actions";
import { initialUserState } from "../../../services/redux/User/user.reducer";
import { useRoute } from "@react-navigation/native";

jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual(
    "../../../services/redux/User/user.actions"
  );

  return {
    saveUserFrenchLevelActionCreator: jest.fn(
      actions.saveUserFrenchLevelActionCreator
    ),
  };
});

jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
}));

describe("Filter french level", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "FilterFrenchlevel",
    });
  });

  it("should render correctly when no french level selected", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when french level selected", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, frenchLevel: "Je parle bien" },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should validate when clicking on rightbutton", () => {
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, frenchLevel: "Je parle bien" },
      },
    });

    const Button = component.getByTestId("test-validate-button");
    act(() => {
      fireEvent.press(Button);
    });
    expect(saveUserFrenchLevelActionCreator).toHaveBeenCalledWith({
      frenchLevel: "Je parle bien",
      shouldFetchContents: false,
    });
    expect(navigate).toHaveBeenCalledWith("FinishOnboarding");
  });

  it("should select level when click on it", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
    });

    const AgeButton = component.getByTestId("test-filter-french_level_b");

    act(() => {
      fireEvent.press(AgeButton);
    });
    expect(component).toMatchSnapshot();
  });
});
