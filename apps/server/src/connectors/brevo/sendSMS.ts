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
  } catch (error) {
<<<<<<< staging-backend
    if (error instanceof HttpError) {
      logger.error("[Brevo] Error sending SMS", {
        message: error.message,
        statusCode: error.response.statusCode,
      });
    } else {
      logger.error("[Brevo] Unknown error sending SMS", { error });
    }
=======
>>>>>>> master-backend
    return {
      status: error instanceof HttpError ? error.response.statusCode : 500,
      sent: false,
    };
  }
};
