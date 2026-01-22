import type { ContentLinkRequest, Languages } from "@refugies-info/api-types";
import { InternalError, InvalidRequestError, NotFoundError } from "~/errors";
import { getLocaleString as t } from "~/libs/getLocaleString";
import logger from "~/logger";
import { getDispositifByIdWithAllFields } from "~/modules/dispositif/dispositif.repository";
import { sendSMS } from "~/services";
import type { Response } from "~/types/interface";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  const dispositif = await getDispositifByIdWithAllFields(body.id);
  if (!dispositif) throw new NotFoundError("[contentLink] Dispositif not found");
  if (!dispositif.translations)
    throw new NotFoundError("[contentLink] Dispositif has no translations");

  const translation =
    dispositif.translations[body.locale as Languages] || dispositif.translations.fr;

  if (!translation || !translation.content || !translation.content.titreInformatif) {
    throw new NotFoundError(
      `[contentLink] Content or title not found for locale ${body.locale} and fallback fr`,
    );
  }

  const title: string = translation.content.titreInformatif;
  const text = t(body.locale, "contentLink", { title: title, link: body.url });
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    logger.error("[contentLink] SMS not sent", smsSentOk);
    if (smsSentOk.status === 400) throw new InvalidRequestError("[contentLink] Invalid request");
    throw new InternalError(`[contentLink] SMS not sent. Status: ${smsSentOk.status}`);
  }

  return { text: "success" };
};
