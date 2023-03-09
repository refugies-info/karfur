import logger from "../../../logger";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { Response } from "../../../types/interface";
import { ContentLinkRequest } from "api-types";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  // TODO: use locale to translate this
  const text = `Bonjour\nVoici le lien vers la fiche ${body.title} : ${body.url}`
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk) throw new Error("SMS not sent.");

  return { text: "success" }
};
