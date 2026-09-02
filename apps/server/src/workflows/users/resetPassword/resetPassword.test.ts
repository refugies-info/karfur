import * as mailService from "~/modules/mail/mail.service";
import { resetEmailThrottle } from "~/modules/users/emailThrottle";
import * as usersRep from "~/modules/users/users.repository";
import { resetPassword } from "./resetPassword";

jest.mock("../../../modules/users/users.repository", () => ({
  getUserByEmailFromDB: jest.fn(),
  updateUserInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendResetPasswordMail: jest.fn(),
}));

const user = { _id: "userId", email: "test@example.com" };

describe("resetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetEmailThrottle();
    jest.spyOn(usersRep, "getUserByEmailFromDB").mockResolvedValue(user as any);
    jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sends the reset mail", async () => {
    const sendMailMock = jest.spyOn(mailService, "sendResetPasswordMail").mockResolvedValue(null);

    const res = await resetPassword({ email: "test@example.com" });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ text: "success", data: { email: "test@example.com" } });
  });

  it("rejects a second send within 60 seconds, whatever the case or spacing", async () => {
    const sendMailMock = jest.spyOn(mailService, "sendResetPasswordMail").mockResolvedValue(null);

    await resetPassword({ email: "test@example.com" });

    await expect(resetPassword({ email: " TEST@Example.com " })).rejects.toMatchObject({
      status: 429,
      code: "RESET_PASSWORD_TOO_SOON",
    });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it("allows a new send after 60 seconds", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const sendMailMock = jest.spyOn(mailService, "sendResetPasswordMail").mockResolvedValue(null);

    await resetPassword({ email: "test@example.com" });
    jest.setSystemTime(new Date("2026-01-01T00:01:00Z"));
    await resetPassword({ email: "test@example.com" });

    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });

  it("releases the lock when the send fails", async () => {
    const sendMailMock = jest
      .spyOn(mailService, "sendResetPasswordMail")
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(null);

    await expect(resetPassword({ email: "test@example.com" })).rejects.toThrow("boom");

    await resetPassword({ email: "test@example.com" });
    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });

  it("does not throttle an unknown email", async () => {
    jest.spyOn(usersRep, "getUserByEmailFromDB").mockResolvedValue(null);

    await expect(resetPassword({ email: "nobody@example.com" })).rejects.toMatchObject({
      status: 404,
    });
    await expect(resetPassword({ email: "nobody@example.com" })).rejects.toMatchObject({
      status: 404,
    });
  });
});
