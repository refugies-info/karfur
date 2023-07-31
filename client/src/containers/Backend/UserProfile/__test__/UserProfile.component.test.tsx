// @ts-nocheck
import UserProfile from "../UserProfile";
import { act } from "react-test-renderer";
import { wrapWithProvidersAndRender, translationMock } from "../../../../../jest/lib/wrapWithProvidersAndRender";
import { initialMockStore } from "__fixtures__/reduxStore";
import API from "utils/API";
import { saveUserActionCreator } from "services/User/user.actions";
import Swal from "sweetalert2";
import "jest-styled-components";
jest.mock("next/router", () => require("next-router-mock"));

jest.mock("utils/API", () => ({
  __esModule: true, // this property makes it work
  default: { updateUser: jest.fn(), updatePassword: jest.fn() },
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
  });

  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          loadingStatus: { FETCH_USER: { isLoading: true } },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: { user: { email: "email@gmail.com", username: "username" } },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    expect(component.root.findByProps({ "data-test-id": "test-save-email" }).props.disabled).toBe(true);
    expect(component.root.findByProps({ "data-test-id": "test-save-pseudo" }).props.disabled).toBe(true);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when changing password", () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: { user: { email: "email@gmail.com", username: "username" } },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    act(() => {
      component.root.findByProps({ "data-test-id": "test-modify-password" }).props.onClick();
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should change username", async () => {
    API.updateUser.mockResolvedValueOnce("test");
    // onPseudoModificationValidate is async and use useState --> https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    const promise = Promise.resolve();

    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: {
            user: {
              email: "email@gmail.com",
              username: "username",
              _id: "userId",
            },
          },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    act(() => {
      component.root.findByProps({ id: "username" }).props.onChange({ target: { id: "username", value: "pseudo" } });
    });
    expect(component.root.findByProps({ "data-test-id": "test-save-pseudo" }).props.disabled).toBe(false);
    act(() => {
      component.root.findByProps({ "data-test-id": "test-save-pseudo" }).props.onClick();
    });
    expect(API.updateUser).toHaveBeenCalledWith("userId", {
      user: { username: "pseudo" },
      action: "modify-my-details",
    });

    await act(() => promise);
  });

  it("should change email", async () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: {
            user: {
              email: "email@gmail.com",
              username: "username",
              _id: "userId",
            },
          },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    act(() => {
      component.root.findByProps({ id: "username" }).props.onChange({
        target: { id: "email", value: "newEmail@gmail.com" },
      });
    });
    expect(component.root.findByProps({ "data-test-id": "test-save-email" }).props.disabled).toBe(false);

    act(() => {
      component.root.findByProps({ "data-test-id": "test-save-email" }).props.onClick();
    });

    expect(saveUserActionCreator).toHaveBeenLastCalledWith("userId", {
      user: { email: "newEmail@gmail.com" },
      action: "modify-my-details",
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Yay...",
      text: "Votre email a bien été modifié",
      icon: "success",
      timer: 1500,
    });
  });

  it("should disable save when new password too weak", async () => {
    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: {
            user: {
              email: "email@gmail.com",
              username: "username",
              _id: "userId",
            },
          },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });

    act(() => {
      component.root.findByProps({ "data-test-id": "test-modify-password" }).props.onClick();
    });

    expect(component.root.findByProps({ "data-test-id": "test-save-password" }).props.disabled).toBe(true);

    act(() => {
      component.root.findByProps({ id: "new-password" }).props.onChange({
        target: { id: "new-password", value: "a" },
      });
      component.root.findByProps({ id: "current-password" }).props.onChange({
        target: { id: "current-password", value: "current" },
      });
    });
    expect(component.root.findByProps({ "data-test-id": "test-save-password" }).props.disabled).toBe(true);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should change password", async () => {
    API.updatePassword.mockResolvedValueOnce("test");
    // onPseudoModificationValidate is async and use useState --> https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    const promise = Promise.resolve();

    window.scrollTo = jest.fn();
    let component;
    act(() => {
      component = wrapWithProvidersAndRender({
        Component: UserProfile,
        reduxState: {
          ...initialMockStore,
          user: {
            user: {
              email: "email@gmail.com",
              username: "username",
              _id: "userId",
            },
          },
        },
        compProps: { t: (_: string, element2: string) => element2 },
      });
    });
    act(() => {
      component.root.findByProps({ "data-test-id": "test-modify-password" }).props.onClick();
    });

    act(() => {
      component.root.findByProps({ id: "new-password" }).props.onChange({
        target: { id: "new-password", value: "testNewPassword1&" },
      });
      component.root.findByProps({ id: "current-password" }).props.onChange({
        target: { id: "current-password", value: "current" },
      });
    });

    expect(component.root.findByProps({ "data-test-id": "test-save-password" }).props.disabled).toBe(false);

    act(() => {
      component.root.findByProps({ "data-test-id": "test-save-password" }).props.onClick();
    });
    expect(API.updatePassword).toHaveBeenCalledWith("userId", {
      currentPassword: "current",
      newPassword: "testNewPassword1&",
    });

    await act(() => promise);
  });
});
