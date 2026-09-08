import * as auth from "~/modules/users/auth";
import { resetEmailThrottle } from "~/modules/users/emailThrottle";
import * as login2FA from "~/modules/users/login2FA";
import { sendCode } from "./sendCode";

jest.mock("../../../modules/users/login2FA", () => ({
  requestEmailLogin: jest.fn(),
}));

jest.mock("../../../modules/users/auth", () => ({
  loginExceptionsManager: jest.fn(),
}));

describe("sendCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetEmailThrottle();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sends the code", async () => {
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);

    const res = await sendCode({ email: "test@example.com" });

    expect(requestEmailLoginMock).toHaveBeenCalledWith("test@example.com");
    expect(res).toBe(true);
  });

  it("rejects a second send within 60 seconds, whatever the case or spacing", async () => {
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);

    await sendCode({ email: "test@example.com" });

    await expect(sendCode({ email: " TEST@Example.com " })).rejects.toMatchObject({
      status: 429,
      code: "SEND_CODE_TOO_SOON",
    });
    expect(requestEmailLoginMock).toHaveBeenCalledTimes(1);
  });

  it("allows a new send after 60 seconds", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const requestEmailLoginMock = jest.spyOn(login2FA, "requestEmailLogin").mockResolvedValue(true);

    await sendCode({ email: "test@example.com" });
    jest.setSystemTime(new Date("2026-01-01T00:01:00Z"));
    await sendCode({ email: "test@example.com" });

    expect(requestEmailLoginMock).toHaveBeenCalledTimes(2);
  });

  it("releases the lock when the send fails", async () => {
    const requestEmailLoginMock = jest
      .spyOn(login2FA, "requestEmailLogin")
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(true);

    await sendCode({ email: "test@example.com" });
    expect(auth.loginExceptionsManager).toHaveBeenCalled();

    await sendCode({ email: "test@example.com" });
    expect(requestEmailLoginMock).toHaveBeenCalledTimes(2);
  });
});
