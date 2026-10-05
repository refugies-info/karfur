import * as brevo from "~/connectors/brevo";
import * as twilio from "~/connectors/twilio";
import { TooManyRequestsError } from "~/errors";
import { resetSmsThrottle, SMS_THROTTLE_MAX_PER_WINDOW } from "~/modules/sms/smsThrottle";
import { sendSMS } from "./sms";

jest.mock("~/connectors/brevo");
jest.mock("~/connectors/twilio");
jest.mock("~/logger");

const mockBrevo = brevo.sendSMS as jest.Mock;
const mockTwilio = twilio.sendSMS as jest.Mock;

describe("sendSMS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSmsThrottle();
  });

  it("falls back to twilio when brevo fails", async () => {
    mockBrevo.mockResolvedValue({ status: 402, sent: false });
    mockTwilio.mockResolvedValue({ status: 201, sent: true });

    await expect(sendSMS("hello", "+33600000000")).resolves.toEqual({ status: 201, sent: true });
  });

  it("blocks a recipient once the limit is reached, whatever the number format", async () => {
    mockBrevo.mockResolvedValue({ status: 201, sent: true });

    for (let i = 0; i < SMS_THROTTLE_MAX_PER_WINDOW; i++) {
      await sendSMS("hello", "+33600000000");
    }

    await expect(sendSMS("hello", "06 00 00 00 00")).rejects.toThrow(TooManyRequestsError);
    expect(mockBrevo).toHaveBeenCalledTimes(SMS_THROTTLE_MAX_PER_WINDOW);
  });

  it("does not block other recipients", async () => {
    mockBrevo.mockResolvedValue({ status: 201, sent: true });

    for (let i = 0; i < SMS_THROTTLE_MAX_PER_WINDOW; i++) {
      await sendSMS("hello", "+33600000000");
    }

    await expect(sendSMS("hello", "+33611111111")).resolves.toEqual({ status: 201, sent: true });
  });

  it("does not count failed sends", async () => {
    mockBrevo.mockResolvedValue({ status: 500, sent: false });
    mockTwilio.mockResolvedValue({ status: 500, sent: false });

    for (let i = 0; i < SMS_THROTTLE_MAX_PER_WINDOW + 2; i++) {
      await expect(sendSMS("hello", "+33600000000")).resolves.toEqual({
        status: 500,
        sent: false,
      });
    }
  });
});
