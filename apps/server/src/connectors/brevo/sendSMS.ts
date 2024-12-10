import { HttpError, SendTransacSms, TransactionalSMSApi, TransactionalSMSApiApiKeys } from "@getbrevo/brevo";
import { SendSMSResult } from "~/services";

const apiInstance = new TransactionalSMSApi();

const { BREVO_API_KEY, SMS_SENDER } = process.env;

apiInstance.setApiKey(TransactionalSMSApiApiKeys.apiKey, BREVO_API_KEY);

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  const sms = new SendTransacSms();
  sms.content = text;
  sms.recipient = phone;
  sms.sender = SMS_SENDER.replace("+", "00");
  sms.organisationPrefix = "Réfugiés.info";

  try {
    const { response } = await apiInstance.sendTransacSms(sms);
    return { status: response.statusCode, sent: response.statusCode === 201 };
  } catch (error) {
    return { status: error instanceof HttpError ? error.response.statusCode : 500, sent: false };
  }
};
