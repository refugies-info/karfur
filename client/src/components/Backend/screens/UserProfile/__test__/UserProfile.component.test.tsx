import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import "jest-styled-components";
import { initialMockStore } from "__fixtures__/reduxStore";
import { testUser } from "__fixtures__/user";
import { setupGoogleMock } from "__mocks__/react-google-autocomplete";
import { wrapWithProvidersAndRenderForTesting } from "../../../../../../jest/lib/wrapWithProvidersAndRender";
import { UserProfile } from "../UserProfile";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("components/UI/Tooltip", () => jest.fn().mockReturnValue(<></>));
jest.mock("@codegouvfr/react-dsfr/SearchBar", () => ({ SearchBar: jest.fn().mockReturnValue(<></>) }));

jest.mock("utils/API", () => ({
  __esModule: true, // this property makes it work
  default: {
    updateUser: jest.fn(),
    isInContacts: jest.fn().mockResolvedValue({ isInContacts: false }),
    isAuth: jest.fn().mockReturnValue(true),
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
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER: { isLoading: true } },
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly", () => {
    window.scrollTo = jest.fn();
    const { asFragment } = wrapWithProvidersAndRenderForTesting({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        user: { ...initialMockStore.user, user: { ...testUser } },
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly when editing profile", async () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRenderForTesting({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        user: { ...initialMockStore.user, user: { ...testUser } },
      },
    });
    component.getByText("Modifier mes informations personnelles").click();
    await waitFor(() => expect(component.getByTitle("pseudo-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("firstname-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("email-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("phone-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("old-password-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("new-password-input")).not.toBeDisabled());
  });

  it("should render correctly when editing profile without password", async () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRenderForTesting({
      Component: UserProfile,
      reduxState: {
        ...initialMockStore,
        user: { ...initialMockStore.user, user: { ...testUser, sso: true } },
      },
    });
    component.getByText("Modifier mes informations personnelles").click();
    await waitFor(() => expect(component.getByTitle("pseudo-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("firstname-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("email-input")).not.toBeDisabled());
    await waitFor(() => expect(component.getByTitle("phone-input")).not.toBeDisabled());
    await waitFor(() => expect(component.queryByTitle("old-password-input")).not.toBeInTheDocument());
    await waitFor(() => expect(component.queryByTitle("new-password-input")).not.toBeInTheDocument());
  });
});
