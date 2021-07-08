import { FilterFrenchLevel } from "../FilterFrenchLevel";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { initialRootStateFactory } from "../../../services/redux/reducers";
import { act, fireEvent } from "react-native-testing-library";
import { saveUserFrenchLevelActionCreator } from "../../../services/redux/User/user.actions";

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

describe("Filter french level", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        user: { frenchLevel: "Je parle bien" },
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
        user: { frenchLevel: "Je parle bien" },
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

    const AgeButton = component.getByTestId("test-filter-Je parle bien");

    act(() => {
      fireEvent.press(AgeButton);
    });
    expect(component).toMatchSnapshot();
  });
});
