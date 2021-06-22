import { FilterCity } from "../FilterCity";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "react-native-testing-library";
import { saveUserLocationActionCreator } from "../../../services/redux/User/user.actions";

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
  };
});

describe("Filter city", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render correctly when no city", () => {
    let component;
    component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when city selected", () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { city: "city", department: "dep" },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it("should validate when clicking on rightbutton", () => {
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterCity,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: { city: "city", department: "dep" },
      },
    });

    const Button = component.getByTestId("test-validate-button");
    act(() => {
      fireEvent.press(Button);
    });
    expect(saveUserLocationActionCreator).toHaveBeenCalledWith({
      city: "city",
      dep: "dep",
    });
    expect(navigate).toHaveBeenCalledWith("FilterAge");
  });
});
