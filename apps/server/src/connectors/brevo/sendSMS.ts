import {
  HttpError,
  SendTransacSms,
  TransactionalSMSApi,
  TransactionalSMSApiApiKeys,
} from "@getbrevo/brevo";
import { phone as parse } from "phone";
import logger from "~/logger";
import type { SendSMSResult } from "~/services";

const apiInstance = new TransactionalSMSApi();

const { BREVO_API_KEY, SMS_SENDER } = process.env;

apiInstance.setApiKey(TransactionalSMSApiApiKeys.apiKey, BREVO_API_KEY);

const e164 = (phone: string): string => {
  let res = parse(phone, { country: null });
  if (res.isValid) return res.phoneNumber;
  res = parse(phone, { country: "FR" });
  if (res.isValid) return res.phoneNumber;
  return phone;
};

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  const sms = new SendTransacSms();
  sms.content = text;
  sms.recipient = e164(phone);
  sms.sender = SMS_SENDER.replace("+", "00");
  sms.organisationPrefix = "Réfugiés.info";
  sms.unicodeEnabled = true; // Support arabic, emojis, etc.

  try {
    const { response } = await apiInstance.sendTransacSms(sms);
    return { status: response.statusCode, sent: response.statusCode === 201 };
  } catch (error: any) {
    const statusCode =
      error instanceof HttpError
        ? error.response.statusCode
        : error.response?.status || error.status || 500;

    const message = error instanceof HttpError ? error.message : error.message || "Unknown error";

    logger.error("[Brevo] Error sending SMS", {
      message,
      statusCode,
      errorObj: error, // Keep full object for debug just in case
    });

    return {
      status: statusCode,
      sent: false,
    };
  }
};
