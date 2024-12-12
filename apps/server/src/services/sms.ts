import * as brevo from "~/connectors/brevo";
import * as twilio from "~/connectors/twilio";

export type SendSMSResult = { status: number; sent: boolean };

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  const brevoRes = await brevo.sendSMS(text, phone);
  // Try twilio if brevo status is 402 "not enough credits"
  if (brevoRes.sent || brevoRes.status !== 402) return brevoRes;
  const twilioRes = await twilio.sendSMS(text, phone);
  return twilioRes;
};
