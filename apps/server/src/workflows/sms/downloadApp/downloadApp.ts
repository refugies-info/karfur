import type { DownloadAppRequest } from "@refugies-info/api-types";
import { InvalidRequestError, ServiceUnavailableError } from "~/errors";
import { getLocaleString as t } from "~/libs/getLocaleString";
import logger from "~/logger";
import { sendSMS } from "~/services";
import type { Response } from "~/types/interface";

export const downloadApp = async (body: DownloadAppRequest): Response => {
  logger.info("[downloadApp] received", body);

  const text = `${t(body.locale, "downloadApp")} https://refugies.info/fr/download-app`;
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    logger.error("[downloadApp] SMS not sent", smsSentOk);
    if (smsSentOk.status === 400) throw new InvalidRequestError("[downloadApp] Invalid request");
    throw new ServiceUnavailableError(
      "[downloadApp] SMS provider unavailable",
      "SMS_PROVIDER_UNAVAILABLE",
      {
        status: smsSentOk.status,
      },
    );
  }

  return { text: "success" };
};
