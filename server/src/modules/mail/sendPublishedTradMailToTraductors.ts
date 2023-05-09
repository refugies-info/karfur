import logger from "../../logger";
import { uniq } from "lodash";
import { getUserById } from "../users/users.repository";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { sendPublishedTradMailToTraductorsService } from "./mail.service";
import { Dispositif } from "../../typegoose";
import { ContentType, Languages, UserStatus } from "@refugies-info/api-types";
import { findTraductors } from "../traductions/traductions.repository";

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
    const allTraductors = await findTraductors(dispositif._id, locale);
    const traductors = uniq(allTraductors.map(t => t.userId.toString()));
    await Promise.all(traductors.map(async (tradId) => {
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
    }));
  } catch (e) {
    logger.info("[sendPublishedTradMailToTraductors] error", e);
  }
};
