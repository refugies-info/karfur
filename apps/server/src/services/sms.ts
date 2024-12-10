import * as brevo from "~/connectors/brevo";
import * as twilio from "~/connectors/twilio";

export type SendSMSResult = { status: number; sent: boolean };

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  const brevoRes = await brevo.sendSMS(text, phone);
  if (brevoRes.sent) return brevoRes;
  const twilioRes = await twilio.sendSMS(text, phone);
  return twilioRes;
};
