import logger from "../../../logger";
import { InvalidRequestError } from "../../../errors";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { Response } from "../../../types/interface";
import { getLocaleString as t } from "../../../libs/getLocaleString";
import { ContentLinkRequest } from "@refugies-info/api-types";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  const text = t(body.locale, "contentLink", { title: body.title, link: body.url });
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    if (smsSentOk.status === 400) throw new InvalidRequestError("[contentLink] Invalid request")
    throw new Error("[contentLink] SMS not sent.");
  }

  return { text: "success" };
};
