import { ContentLinkRequest, Languages } from "@refugies-info/api-types";
import { sendSMS } from "~/connectors/twilio/sendSMS";
import { InvalidRequestError, NotFoundError } from "~/errors";
import { getLocaleString as t } from "~/libs/getLocaleString";
import logger from "~/logger";
import { getDispositifByIdWithAllFields } from "~/modules/dispositif/dispositif.repository";
import { Response } from "~/types/interface";

export const contentLink = async (body: ContentLinkRequest): Response => {
  logger.info("[contentLink] received", body);

  const dispositif = await getDispositifByIdWithAllFields(body.id);
  if (!dispositif) throw new NotFoundError("[contentLink] Dispositif not found");
  const title: string =
    dispositif.translations[body.locale as Languages]?.content?.titreInformatif ||
    dispositif.translations.fr.content.titreInformatif;
  const text = t(body.locale, "contentLink", { title: title, link: body.url });
  const smsSentOk = await sendSMS(text, body.phone);
  if (!smsSentOk.sent) {
    if (smsSentOk.status === 400) throw new InvalidRequestError("[contentLink] Invalid request");
    throw new Error("[contentLink] SMS not sent.");
  }

  return { text: "success" };
};
