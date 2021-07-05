import { FilterAge } from "../FilterAge";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "react-native-testing-library";
import { saveUserAgeActionCreator } from "../../../services/redux/User/user.actions";

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

describe("Filter age", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when no age selected", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when age selected", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { age: "0 à 17 ans" },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should validate when clicking on rightbutton", () => {
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { age: "0 à 17 ans" },
      },
    });

    const Button = component.getByTestId("test-validate-button");
    act(() => {
      fireEvent.press(Button);
    });
    expect(saveUserAgeActionCreator).toHaveBeenCalledWith("0 à 17 ans");
    expect(navigate).toHaveBeenCalledWith("FilterFrenchLevel");
  });

  it("should select age when click on it", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterAge,
      compProps: { navigation: { goBack: jest.fn() } },
    });

    const AgeButton = component.getByTestId("test-filter-26 ans et plus");

    act(() => {
      fireEvent.press(AgeButton);
    });
    expect(component).toMatchSnapshot();
  });
});
