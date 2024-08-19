// @ts-nocheck
import { sendSubscriptionReminderMailService } from "../../../modules/mail/mail.service";
import { sendSubscriptionReminderMail } from "./sendSubscriptionReminderMail";

/* jest.mock("../../../modules/mail/mail.service", () => ({
  sendSubscriptionReminderMailService: jest.fn(),
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("sendSubscriptionReminderMailService", () => {
  const res = mockResponse();
  it("Should return 405 if request not from site", async () => {
    await sendSubscriptionReminderMail({ fromSite: false }, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("Should call sendSubscriptionReminderMailService and return 200", async () => {
    await sendSubscriptionReminderMail(
      { fromSite: true, body: { email: "email" } },
      res
    );
    expect(sendSubscriptionReminderMailService).toHaveBeenCalledWith("email");
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("Should call sendSubscriptionReminderMailService and return 500 when it throws", async () => {
    sendSubscriptionReminderMailService.mockRejectedValueOnce(
      new Error("erreur")
    );
    await sendSubscriptionReminderMail(
      { fromSite: true, body: { email: "email" } },
      res
    );
    expect(sendSubscriptionReminderMailService).toHaveBeenCalledWith("email");
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
