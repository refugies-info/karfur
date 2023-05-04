import logger from "../../logger";
import { asyncForEach } from "../../libs/asyncForEach";
import { getUserById } from "../users/users.repository";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { sendPublishedTradMailToTraductorsService } from "./mail.service";
import { Dispositif } from "../../typegoose";
import { ContentType, Languages, UserStatus } from "@refugies-info/api-types";

export const sendPublishedTradMailToTraductors = async (
  locale: Languages,
  dispositif: Dispositif,
) => {
  logger.info("[sendPublishedTradMailToTraductors] received for language", {
    locale,
  });
  try {
    const langue = getFormattedLocale(locale);
    const lien = "https://refugies.info/" + dispositif.typeContenu + "/" + dispositif._id.toString();
    // FIXME : choose the users to send email to
    await asyncForEach([], async (tradId) => {
      try {
        const userNeededFields = {
          username: 1,
          email: 1,
          status: 1,
        };

        const membreFromDB = await getUserById(tradId, userNeededFields);
        if (membreFromDB.status !== UserStatus.DELETED && membreFromDB.email) {
          await sendPublishedTradMailToTraductorsService({
            dispositifId: dispositif._id.toString(),
            userId: tradId,
            titreInformatif: dispositif.translations.fr.content.titreInformatif,
            titreMarque: dispositif.translations.fr.content.titreMarque,
            lien,
            email: membreFromDB.email,
            pseudo: membreFromDB.username,
            langue,
            isDispositif: dispositif.typeContenu === ContentType.DISPOSITIF,
          });
        }
      } catch (error) {
        logger.info("[sendPublishedTradMailToTraductors] error while sending mail to user", {
          userId: tradId,
        });
      }
    });
  } catch (e) {
    logger.info("[sendPublishedTradMailToTraductors] error", e);
  }
};
