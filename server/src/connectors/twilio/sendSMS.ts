import logger from "../../logger";

const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);

export const sendSMS = async (text: string, phone: string): Promise<boolean> => {
  if (!text || !phone) return false;

  return client.messages
    .create({
      from: "+33757902900",
      body: text,
      to: phone,
    })
    .then((message: any) => {
      logger.info("[sendSMS] Message envoyé", { sid: message.sid });
      return true;
    })
    .catch((e: any) => {
      logger.error("[sendSMS] erreur", e);
      return false;
    });
}
