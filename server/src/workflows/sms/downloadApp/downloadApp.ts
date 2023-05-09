import logger from "../../../logger";
import { InvalidRequestError } from "../../../errors";
import { Response } from "../../../types/interface";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { getLocaleString as t } from "../../../libs/getLocaleString";
import { DownloadAppRequest } from "@refugies-info/api-types";

export const downloadApp = async (body: DownloadAppRequest): Response => {
  logger.info("[downloadApp] received", body);

  const text = `${t(body.locale, "downloadApp")} https://refugies.info/fr/download-app`;
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    if (smsSentOk.status === 400) throw new InvalidRequestError("[downloadApp] Invalid request")
    throw new Error("[downloadApp] SMS not sent.");
  }

  return { text: "success" };
};
