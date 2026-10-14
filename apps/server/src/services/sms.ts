import * as brevo from "~/connectors/brevo";
import * as twilio from "~/connectors/twilio";
import { TooManyRequestsError } from "~/errors";
import logger from "~/logger";
import { clearLastSmsSent, getSmsRetryAfter, markSmsSent } from "~/modules/sms/smsThrottle";

export type SendSMSResult = { status: string | number; sent: boolean };

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  const retryAfter = getSmsRetryAfter(phone);
  if (retryAfter > 0) {
    logger.warn("[sendSMS] rate limited", { retryAfter });
    throw new TooManyRequestsError(
      "Trop de SMS envoyés à ce numéro, merci de réessayer plus tard.",
      "SEND_SMS_TOO_MANY",
      { retryAfter },
    );
  }

  // Locked before the provider call so concurrent requests cannot all go through.
  markSmsSent(phone);

  const brevoRes = await brevo.sendSMS(text, phone);
  // Try twilio if brevo status is 402 "not enough credits" or other error
  if (brevoRes.sent) return brevoRes;
  const twilioRes = await twilio.sendSMS(text, phone);
  if (!twilioRes.sent) clearLastSmsSent(phone);
  return twilioRes;
};
