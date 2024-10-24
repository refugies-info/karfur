import { useRoute } from "@react-navigation/native";
import { MobileFrenchLevel } from "@refugies-info/api-types";
import { fireEvent } from "@testing-library/react-native";
import { initialRootStateFactory } from "~/services/redux/reducers";
import { saveUserFrenchLevelActionCreator } from "~/services/redux/User/user.actions";
import { initialUserState } from "~/services/redux/User/user.reducer";
import { wrapWithProvidersAndRender } from "../../../jest/wrapWithProvidersAndRender";
import { FilterFrenchLevel } from "../FilterFrenchLevel";

// jest.useFakeTimers();

jest.mock("../../../hooks/useTranslationWithRTL", () => ({
  useTranslationWithRTL: jest.fn().mockReturnValue({
    isRTL: false,
    t: jest.fn().mockImplementation((_, arg2) => arg2),
  }),
}));

jest.mock("../../../services/redux/User/user.actions", () => {
  const actions = jest.requireActual("../../../services/redux/User/user.actions");

  return {
    saveUserFrenchLevelActionCreator: jest.fn(actions.saveUserFrenchLevelActionCreator),
  };
});

// jest.mock("@react-navigation/core", () => ({
//   ...jest.requireActual("@react-navigation/core"),
//   useRoute: jest.fn(),
// }));

describe("Filter french level", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      name: "FilterFrenchlevel",
    });
  });

  it("should render correctly when no french level selected", async () => {
    const component = await wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
    });
    expect(component).toMatchSnapshot();
  });

  it("should render correctly when french level selected", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          frenchLevel: MobileFrenchLevel["Je parle bien"],
        },
      },
    });
    expect(component).toMatchSnapshot();
  });

  it.skip("should validate when clicking on rightbutton", async () => {
    // TODO: fix test
    const navigate = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn(), navigate } },
      reduxState: {
        ...initialRootStateFactory(),
        user: {
          ...initialUserState,
          frenchLevel: MobileFrenchLevel["Je parle bien"],
        },
      },
    });

    const Button = component.getByTestId("test-next-button");
    fireEvent.press(Button);
    expect(saveUserFrenchLevelActionCreator).toHaveBeenCalledWith({
      frenchLevel: "Je parle bien",
      shouldFetchContents: false,
    });
    expect(navigate).toHaveBeenCalledWith("FinishOnboarding");
  });

  it("should select level when click on it", async () => {
    const component = wrapWithProvidersAndRender({
      Component: FilterFrenchLevel,
      compProps: { navigation: { goBack: jest.fn() } },
    });

    const AgeButton = component.getByTestId("test-filter-french_level_b");

    fireEvent.press(AgeButton);
    expect(component).toMatchSnapshot();
  });
});
