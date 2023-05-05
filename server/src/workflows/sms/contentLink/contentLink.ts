import logger from "../../../logger";
import { InvalidRequestError } from "../../../errors";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { Response } from "../../../types/interface";
import { ContentLinkRequest } from "@refugies-info/api-types";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  // TODO: use locale to translate this
  const text = `Bonjour\nVoici le lien vers la fiche ${body.title} : ${body.url}`;
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    if (smsSentOk.status === 400) throw new InvalidRequestError("[contentLink] Invalid request")
    throw new Error("[contentLink] SMS not sent.");
  }

  return { text: "success" };
};
