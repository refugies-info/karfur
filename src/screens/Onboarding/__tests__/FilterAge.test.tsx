import { FilterAge } from "../FilterAge";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "@testing-library/react-native";
import { saveUserAgeActionCreator } from "../../../services/redux/User/user.actions";
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
    saveUserAgeActionCreator: jest.fn(actions.saveUserAgeActionCreator),
  };
});
jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
}));

describe("Filter age", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "FilterAge",
    });
  });

  it("should render correctly when no age selected", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when age selected", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, age: "0 à 17 ans" },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it.skip("should validate when clicking on rightbutton", async () => {
    // TODO: fix test
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, age: "0 à 17 ans" },
      },
    });

    const Button = component.getByTestId("test-next-button");
    act(() => {
      fireEvent.press(Button);
    });
    expect(saveUserAgeActionCreator).toHaveBeenCalledWith({
      age: "0 à 17 ans",
      shouldFetchContents: false,
    });
    expect(navigate).toHaveBeenCalledWith("FilterFrenchLevel");
  });

  it("should select age when click on it", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
    });

    const AgeButton = component.getByTestId("test-filter-age_26_100");

    act(() => {
      fireEvent.press(AgeButton);
    });
    expect(component).toMatchSnapshot();
  });
});
