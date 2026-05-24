import { BrevoClient, BrevoError } from "@getbrevo/brevo";
import { phone as parse } from "phone";
import logger from "~/logger";
import type { SendSMSResult } from "~/services";

const { BREVO_API_KEY, SMS_SENDER } = process.env;

const client = new BrevoClient({ apiKey: BREVO_API_KEY });

const e164 = (phone: string): string => {
  let res = parse(phone, { country: null });
  if (res.isValid) return res.phoneNumber;
  res = parse(phone, { country: "FR" });
  if (res.isValid) return res.phoneNumber;
  return phone;
};

const brevoSender = (sender: string): string => {
  if (sender.startsWith("+")) return sender.slice(1);
  if (/^00\d+$/.test(sender)) return sender.slice(2);
  return sender;
};

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  try {
    const { rawResponse } = await client.transactionalSms
      .sendTransacSms({
        content: text,
        recipient: e164(phone),
        sender: brevoSender(SMS_SENDER || ""),
        organisationPrefix: "Réfugiés.info",
        unicodeEnabled: true, // Support arabic, emojis, etc.
      })
      .withRawResponse();
    return { status: rawResponse.status, sent: rawResponse.status === 201 };
  } catch (error) {
    if (error instanceof BrevoError) {
      logger.error("[Brevo] Error sending SMS", {
        message: error.message,
        statusCode: error.statusCode,
      });
    } else {
      logger.error("[Brevo] Unknown error sending SMS", { error });
    }
    return {
      status: error instanceof BrevoError ? (error.statusCode ?? 500) : 500,
      sent: false,
    };
  }
};
