import { changePassword } from "./changePassword";
import * as usersRep from "../../../modules/users/users.repository";
import { loginExceptionsManager } from "../../../modules/users/auth";
import { UserModel } from "../../../typegoose";
import { LoginErrorType } from "../../../modules/users/LoginError";
import { UserStatus } from "@refugies-info/api-types";
import passwordHash from "password-hash";


jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
  updateUserInDB: jest.fn().mockResolvedValue({ getToken: () => "token" }),
}));

jest.mock("password-hash", () => ({
  __esModule: true, // this property makes it work
  default: { generate: () => "hashedPassword", verify: () => true },
}));

jest.mock("../../../modules/users/auth", () => ({
  loginExceptionsManager: jest.fn()
}))

describe("changePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user and return error if no user", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(null);

    await changePassword("id", "", "");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.USER_DELETED));
  });
  it("should get user and return error if user deleted", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({ status: UserStatus.DELETED }));

    await changePassword("id", "", "");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.USER_DELETED));
  });

  it("should get user and return error if no password", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({}));

    await changePassword("id", "", "");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.INVALID_REQUEST));
  });

  it("should get user and return error if wrong password", async () => {
    const hashVerifyMock = jest.spyOn(passwordHash, 'verify');
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({ password: "test" }));
    hashVerifyMock.mockReturnValueOnce(false);

    await changePassword("id", "", "");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.INVALID_PASSWORD));
  });

  it("should get user and return error if same password", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({ password: "test" }));

    await changePassword("id", "test1", "test1");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.USED_PASSWORD));
  });

  it("should get user and return error if password too weak", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({ password: "test" }));

    await changePassword("id", "test1", "a");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.PASSWORD_TOO_WEAK));
  });

  it("should get user and return hashedPassword if ok", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(new UserModel({ password: "test" }));

    const res = await changePassword("id", "test1", "Test1a@");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", {});
    expect(loginExceptionsManager).not.toHaveBeenCalled();
    expect(res).toEqual("hashedPassword");
  });
});
