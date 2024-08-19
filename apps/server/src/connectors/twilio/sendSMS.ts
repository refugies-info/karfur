import logger from "../../logger";

const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);

type Res = { status: number, sent: boolean }

export const sendSMS = async (text: string, phone: string): Promise<Res> => {
  if (!text || !phone) return { status: 400, sent: false };

  return client.messages
    .create({
      from: "+33757902900",
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
}
