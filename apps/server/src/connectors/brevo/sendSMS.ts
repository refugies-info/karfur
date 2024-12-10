import { SendTransacSms, TransactionalSMSApi, TransactionalSMSApiApiKeys } from "@getbrevo/brevo";

const apiInstance = new TransactionalSMSApi();

const { BREVO_API_KEY, SMS_SENDER } = process.env;

apiInstance.setApiKey(TransactionalSMSApiApiKeys.apiKey, BREVO_API_KEY);

type Res = { status: number; sent: boolean };

export const sendSMS = async (text: string, phone: string): Promise<Res> => {
  const sms = new SendTransacSms();
  sms.content = text;
  sms.recipient = phone;
  sms.sender = SMS_SENDER;

  const { response } = await apiInstance.sendTransacSms(sms);
  return { status: response.statusCode, sent: response.statusCode === 201 };
};
