import type { CourseListLinkRequest } from "@refugies-info/api-types";
import { InvalidRequestError, ServiceUnavailableError } from "~/errors";
import { getLocaleString as t } from "~/libs/getLocaleString";
import logger from "~/logger";
import { sendSMS } from "~/services";
import type { Response } from "~/types/interface";

/**
 * Sends an SMS with a link to the current (filtered) Espace FR course list
 */
export const courseListLink = async (body: CourseListLinkRequest): Response => {
  logger.info("[courseListLink] received", body);

  const text = t(body.locale, "courseListLink", { link: body.url });

  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    logger.error("[courseListLink] SMS not sent", smsSentOk);
    if (smsSentOk.status === 400) throw new InvalidRequestError("[courseListLink] Invalid request");
    throw new ServiceUnavailableError(
      "[courseListLink] SMS provider unavailable",
      "SMS_PROVIDER_UNAVAILABLE",
      {
        status: smsSentOk.status,
      },
    );
  }

  return { text: "success" };
};
