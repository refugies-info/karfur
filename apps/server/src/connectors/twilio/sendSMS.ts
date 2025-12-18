import twilio from "twilio";
import type { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import logger from "~/logger";
import type { SendSMSResult } from "~/services";

const { accountSid, authToken, SMS_SENDER } = process.env;

const client = twilio(accountSid, authToken);

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  if (!text || !phone) return { status: 400, sent: false };

  return client.messages
    .create({
      from: SMS_SENDER,
      body: text,
      to: phone,
    })
    .then((message: MessageInstance) => {
      logger.info("[sendSMS] Message envoyé: ", { sid: message.sid });
      return { status: message.status, sent: true };
    })
    .catch((e: { status: string }) => {
      logger.error("[sendSMS] erreur: ", e);
      return { status: e.status, sent: false };
    });
};
