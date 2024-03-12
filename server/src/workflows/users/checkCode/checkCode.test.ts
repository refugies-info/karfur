import { checkCode } from "./checkCode";
import * as auth from "../../../modules/users/auth";
import * as login2FA from "../../../modules/users/login2FA";
import { LoginErrorType } from "../../../modules/users/LoginError";


jest.mock("../../../modules/users/login2FA", () => ({
  verifyCode: jest.fn(),
}));

jest.mock("../../../modules/users/auth", () => ({
  loginExceptionsManager: jest.fn(),
  isMfaCodeOk: jest.fn(),
  logUser: jest.fn(),
  needs2FA: jest.fn(),
}))

describe("checkCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throw error if invalid code", async () => {
    const needs2FAMock = jest.spyOn(auth, 'needs2FA');
    needs2FAMock.mockResolvedValue(false);
    const verifyCodeMock = jest.spyOn(login2FA, 'verifyCode');
    verifyCodeMock.mockRejectedValue(new Error(LoginErrorType.WRONG_CODE))

    await checkCode({ code: "a", email: "test@example.com" });
    expect(needs2FAMock).toHaveBeenCalledWith("test@example.com");
    expect(verifyCodeMock).toHaveBeenCalledWith("test@example.com", "a");
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.WRONG_CODE));
  });
  it("logs user if valid code", async () => {
    const needs2FAMock = jest.spyOn(auth, 'needs2FA');
    needs2FAMock.mockResolvedValue(false);
    const verifyCodeMock = jest.spyOn(login2FA, 'verifyCode');
    verifyCodeMock.mockResolvedValue(true);
    const logUserMock = jest.spyOn(auth, 'logUser');
    logUserMock.mockResolvedValue("token");

    const res = await checkCode({ code: "a", email: "test@example.com" });
    expect(needs2FAMock).toHaveBeenCalledWith("test@example.com");
    expect(verifyCodeMock).toHaveBeenCalledWith("test@example.com", "a");
    expect(logUserMock).toHaveBeenCalledWith("test@example.com");
    expect(res).toEqual({ token: "token" })
  });

  it("throw if mfaCode wrong", async () => {
    const needs2FAMock = jest.spyOn(auth, 'needs2FA');
    needs2FAMock.mockResolvedValue(true);
    const isMfaCodeOkMock = jest.spyOn(auth, 'isMfaCodeOk');
    isMfaCodeOkMock.mockResolvedValue(false);
    const verifyCodeMock = jest.spyOn(login2FA, 'verifyCode');
    verifyCodeMock.mockResolvedValue(true);
    const logUserMock = jest.spyOn(auth, 'logUser');
    logUserMock.mockResolvedValue("token");

    await checkCode({ code: "a", email: "test@example.com", mfaCode: "b" });
    expect(needs2FAMock).toHaveBeenCalledWith("test@example.com");
    expect(isMfaCodeOkMock).toHaveBeenCalledWith("b", "test@example.com");
    expect(verifyCodeMock).not.toHaveBeenCalled();
    expect(logUserMock).not.toHaveBeenCalledWith();
    expect(auth.loginExceptionsManager).toHaveBeenCalledWith(new Error(LoginErrorType.WRONG_CODE));
  });

  it("logs user if valid code and mfaCode", async () => {
    const needs2FAMock = jest.spyOn(auth, 'needs2FA');
    needs2FAMock.mockResolvedValue(true);
    const isMfaCodeOkMock = jest.spyOn(auth, 'isMfaCodeOk');
    isMfaCodeOkMock.mockResolvedValue(true);
    const verifyCodeMock = jest.spyOn(login2FA, 'verifyCode');
    verifyCodeMock.mockResolvedValue(true);
    const logUserMock = jest.spyOn(auth, 'logUser');
    logUserMock.mockResolvedValue("token");

    const res = await checkCode({ code: "a", email: "test@example.com", mfaCode: "b" });
    expect(needs2FAMock).toHaveBeenCalledWith("test@example.com");
    expect(isMfaCodeOkMock).toHaveBeenCalledWith("b", "test@example.com");
    expect(verifyCodeMock).toHaveBeenCalledWith("test@example.com", "a");
    expect(logUserMock).toHaveBeenCalledWith("test@example.com");
    expect(res).toEqual({ token: "token" })
  });
});
