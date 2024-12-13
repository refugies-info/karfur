import logger from "~/logger";
import { SendSMSResult } from "~/services";

const { accountSid, authToken, SMS_SENDER } = process.env;
const client = require("twilio")(accountSid, authToken);

export const sendSMS = async (text: string, phone: string): Promise<SendSMSResult> => {
  if (!text || !phone) return { status: 400, sent: false };

  return client.messages
    .create({
      from: SMS_SENDER,
      body: text,
      to: phone,
    })
    .then((message: any) => {
      logger.info("[sendSMS] Message envoyé: ", { sid: message.sid });
      return { status: message.status, sent: true };
    })
    .catch((e: any) => {
      logger.error("[sendSMS] erreur: ", e);
      return { status: e.status, sent: false };
    });
};
