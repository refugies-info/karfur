import logger from "../../../logger";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { ContentLinkRequest } from "../../../controllers/smsController";
import { Response } from "../../../types/interface";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  const text = `Bonjour\nVoici le lien vers la fiche ${body.title} : ${body.url}`
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk) throw new Error("SMS not sent.");

  return { text: "success" }
};
