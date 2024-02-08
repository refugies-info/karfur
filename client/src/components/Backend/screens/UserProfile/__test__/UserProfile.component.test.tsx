import { UserProfile } from "../UserProfile";
import { act, ReactTestRenderer } from "react-test-renderer";
import {
  wrapWithProvidersAndRender,
  wrapWithProvidersAndRenderForTesting,
} from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import { initialMockStore } from "__fixtures__/reduxStore";
import { testUser } from "__fixtures__/user";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import "jest-styled-components";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
import "@testing-library/jest-dom";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("components/UI/Tooltip", () => jest.fn().mockReturnValue(<></>));
jest.mock("@codegouvfr/react-dsfr/SearchBar", () => ({ SearchBar: jest.fn().mockReturnValue(<></>) }));

jest.mock("utils/API", () => ({
  __esModule: true, // this property makes it work
  default: {
    updateUser: jest.fn(),
    isInContacts: jest.fn().mockResolvedValue({ isInContacts: false }),
    updatePassword: jest.fn(),
  },
}));

jest.mock("services/User/user.actions", () => {
  const actions = jest.requireActual("services/User/user.actions");
  return {
    saveUserActionCreator: jest.fn(actions.saveUserActionCreator),
    fetchUserActionCreator: jest.fn(actions.fetchUserActionCreator),
  };
});

describe("UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupGoogleMock();
  });

  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;
    component = wrapWithProvidersAndRender({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER: { isLoading: true } },
      },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly", () => {
    window.scrollTo = jest.fn();
    let component: ReactTestRenderer;
    component = wrapWithProvidersAndRender({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        user: { ...initialMockStore.user, user: { ...testUser } },
      },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when editing profile", async () => {
    window.scrollTo = jest.fn();
    let component: RenderResult;
    act(() => {
      component = wrapWithProvidersAndRenderForTesting({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: { ...initialMockStore.user, user: { ...testUser } },
        },
      });
    });
    act(() => {
      fireEvent.click(component.getByText("Modifier mon profil"));
    });
    await waitFor(() => expect(component.getAllByRole("textbox")[0]).not.toBeDisabled());
  });
});
