import { FilterCity } from "../FilterCity";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "@testing-library/react-native";
import { saveUserLocationActionCreator } from "../../../services/redux/User/user.actions";
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
    saveUserLocationActionCreator: jest.fn(
      actions.saveUserLocationActionCreator
    ),
    removeUserLocalizedWarningHiddenActionCreator: jest.fn(
      actions.removeUserLocalizedWarningHiddenActionCreator
    ),
  };
});

jest.mock("@react-navigation/core", () => ({
  ...jest.requireActual("@react-navigation/core"),
  useRoute: jest.fn(),
}));

describe("Filter city", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "FilterCity",
    });
  });
  it("should render correctly when no city", async () => {
    let component;
    component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when city selected", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, city: "city", department: "dep" },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should validate when clicking on rightbutton", async () => {
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { ...initialUserState, city: "city", department: "dep" },
      },
    });

    const Button = component.getByTestId("test-validate-button");
    act(() => {
      fireEvent.press(Button);
    });
    expect(saveUserLocationActionCreator).toHaveBeenCalledWith({
      city: "city",
      dep: "dep",
      shouldFetchContents: false,
    });
    expect(navigate).toHaveBeenCalledWith("FilterAge");
  });
});
