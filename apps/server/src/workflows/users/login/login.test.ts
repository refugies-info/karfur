import { RoleName, UserStatus } from "@refugies-info/api-types";
import * as auth from "~/modules/users/auth";
import { LoginErrorType } from "~/modules/users/LoginError";
import * as login2FA from "~/modules/users/login2FA";
import * as usersRep from "~/modules/users/users.repository";
import * as usersServ from "~/modules/users/users.service";
import type { User } from "~/typegoose";
import * as endpoint from "./login";

jest.mock("google-auth-library");
jest.mock("@azure/msal-node");

jest.mock("~/modules/users/login2FA", () => ({
  verifyCode: jest.fn(),
  requestEmailLogin: jest.fn(),
}));

jest.mock("~/modules/users/auth", () => ({
  loginExceptionsManager: jest.fn(),
  logUser: jest.fn(),
  needs2FA: jest.fn(),
}));
jest.mock("~/modules/users/users.service", () => ({
  registerUser: jest.fn(),
}));

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("password: user does not exist", async () => {
    const getUserMock = jest
      .spyOn(usersRep, "getUserByEmailFromDB")
      .mockReturnValue({ populate: async (): Promise<User | null> => null } as any);
    const logUserMock = jest.spyOn(auth, "logUser");

    await endpoint.login({ authPassword: { email: "test@example.com", password: "pwd" } });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.NO_ACCOUNT));
  });

  it("password: user deleted", async () => {
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> => ({ status: UserStatus.DELETED }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser");

    await endpoint.login({ authPassword: { email: "test@example.com", password: "pwd" } });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(
      new Error(LoginErrorType.USER_DELETED),
    );
  });

  it("password: no password -> sso", async () => {
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> =>
        ({ status: UserStatus.ACTIVE, password: null }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser");

    await endpoint.login({ authPassword: { email: "test@example.com", password: "pwd" } });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(
      new Error(LoginErrorType.SSO_NO_PASSWORD),
    );
  });

  it("password: wrong password", async () => {
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> =>
        ({
          status: UserStatus.ACTIVE,
          password: "pwd2",
          authenticate: () => false,
        }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser");

    await endpoint.login({ authPassword: { email: "test@example.com", password: "pwd" } });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(
      new Error(LoginErrorType.INVALID_PASSWORD),
    );
  });
  it("password: right password, no 2FA", async () => {
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> =>
        ({
          status: UserStatus.ACTIVE,
          password: "pwd2",
          authenticate: () => true,
        }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser").mockResolvedValue("token");
    const needs2FAMock = jest.spyOn(auth, "needs2FA").mockResolvedValue(false);

    const res = await endpoint.login({
      authPassword: { email: "test@example.com", password: "pwd" },
    });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(needs2FAMock).toHaveBeenCalled();
    expect(logUserMock).toHaveBeenCalled();
    expect(res).toEqual({ token: "token" });
  });
  it("password: right password with 2FA, no code", async () => {
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> =>
        ({
          status: UserStatus.ACTIVE,
          password: "pwd2",
          authenticate: () => true,
        }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser").mockResolvedValue("token");
    const needs2FAMock = jest.spyOn(auth, "needs2FA").mockResolvedValue(true);
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);
    const updateUserMock = jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(null);

    await endpoint.login({ authPassword: { email: "test@example.com", password: "pwd" } });
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(needs2FAMock).toHaveBeenCalled();
    expect(requestEmailLoginMock).toHaveBeenCalledWith("test@example.com");
    expect(updateUserMock).toHaveBeenCalled();
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(
      new Error(LoginErrorType.NO_CODE_SUPPLIED),
    );
  });

  it("google: no account", async () => {
    const authWithGoogleMock = jest
      .spyOn(endpoint, "authWithGoogle")
      .mockResolvedValue({ email: "test@example.com", name: "test" });
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> => null,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser").mockResolvedValue("token");
    const needs2FAMock = jest.spyOn(auth, "needs2FA").mockResolvedValue(true);
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);
    const updateUserMock = jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(null);
    const registerUserMock = jest
      .spyOn(usersServ, "registerUser")
      .mockResolvedValue({ getToken: () => "token" } as any);

    const res = await endpoint.login({ authGoogle: { authCode: "code" }, role: RoleName.CONTRIB });
    expect(authWithGoogleMock).toHaveBeenCalled();
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(registerUserMock).toHaveBeenCalledWith({
      email: "test@example.com",
      role: RoleName.CONTRIB,
      firstName: "test",
    });
    expect(needs2FAMock).not.toHaveBeenCalled();
    expect(requestEmailLoginMock).not.toHaveBeenCalled();
    expect(updateUserMock).not.toHaveBeenCalled();
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toEqual({ token: "token", userCreated: true });
  });

  it("microsoft: no account", async () => {
    const authWithMicrosoftMock = jest
      .spyOn(endpoint, "authWithMicrosoft")
      .mockResolvedValue("test@example.com");
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> => null,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser").mockResolvedValue("token");
    const needs2FAMock = jest.spyOn(auth, "needs2FA").mockResolvedValue(true);
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);
    const updateUserMock = jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(null);
    const registerUserMock = jest
      .spyOn(usersServ, "registerUser")
      .mockResolvedValue({ getToken: () => "token" } as any);

    const res = await endpoint.login({
      authMicrosoft: { authCode: "code" },
      role: RoleName.CONTRIB,
    });
    expect(authWithMicrosoftMock).toHaveBeenCalled();
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(registerUserMock).toHaveBeenCalledWith({
      email: "test@example.com",
      role: RoleName.CONTRIB,
      firstName: null,
    });
    expect(needs2FAMock).not.toHaveBeenCalled();
    expect(requestEmailLoginMock).not.toHaveBeenCalled();
    expect(updateUserMock).not.toHaveBeenCalled();
    expect(logUserMock).not.toHaveBeenCalled();
    expect(auth.loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toEqual({ token: "token", userCreated: true });
  });

  it("microsoft: logged in", async () => {
    const authWithMicrosoftMock = jest
      .spyOn(endpoint, "authWithMicrosoft")
      .mockResolvedValue("test@example.com");
    const getUserMock = jest.spyOn(usersRep, "getUserByEmailFromDB").mockReturnValue({
      populate: async (): Promise<User | null> =>
        ({
          status: UserStatus.ACTIVE,
        }) as any,
    } as any);
    const logUserMock = jest.spyOn(auth, "logUser").mockResolvedValue("token");
    const needs2FAMock = jest.spyOn(auth, "needs2FA").mockResolvedValue(false);
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);
    const updateUserMock = jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(null);
    const registerUserMock = jest.spyOn(usersServ, "registerUser");

    const res = await endpoint.login({ authMicrosoft: { authCode: "code" } });
    expect(authWithMicrosoftMock).toHaveBeenCalled();
    expect(getUserMock).toHaveBeenCalledWith("test@example.com");
    expect(registerUserMock).not.toHaveBeenCalled();
    expect(needs2FAMock).toHaveBeenCalled();
    expect(requestEmailLoginMock).not.toHaveBeenCalled();
    expect(updateUserMock).not.toHaveBeenCalled();
    expect(logUserMock).toHaveBeenCalled();
    expect(auth.loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toEqual({ token: "token" });
  });
});
