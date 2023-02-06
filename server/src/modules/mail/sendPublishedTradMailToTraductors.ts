import logger from "../../logger";
import { asyncForEach } from "../../libs/asyncForEach";
import { getUserById } from "../users/users.repository";
import { getTitreInfoOrMarque } from "../dispositif/dispositif.adapter";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { sendPublishedTradMailToTraductorsService } from "./mail.service";
import { USER_STATUS_DELETED } from "src/typegoose/User";
import { DispositifId } from "src/typegoose";

export const sendPublishedTradMailToTraductors = async (
  traductorIdsList: string[],
  locale: string,
  typeContenu: "dispositif" | "demarche",
  titreInformatif: string | Record<string, string>,
  titreMarque: string | undefined | Record<string, string>,
  dispositifId: DispositifId
) => {
  logger.info("[sendPublishedTradMailToTraductors] received for language", {
    locale
  });
  try {
    const titreInformatifFormatted = getTitreInfoOrMarque(titreInformatif);
    const titreMarqueFormatted = getTitreInfoOrMarque(titreMarque);
    const langue = getFormattedLocale(locale);
    const lien = "https://refugies.info/" + typeContenu + "/" + dispositifId;

    await asyncForEach(traductorIdsList, async (tradId) => {
      try {
        const userNeededFields = {
          username: 1,
          email: 1,
          status: 1
        };

        const membreFromDB = await getUserById(tradId, userNeededFields);
        if (membreFromDB.status !== USER_STATUS_DELETED && membreFromDB.email) {
          await sendPublishedTradMailToTraductorsService({
            dispositifId,
            userId: tradId,
            titreInformatif: titreInformatifFormatted,
            titreMarque: titreMarqueFormatted,
            lien,
            email: membreFromDB.email,
            pseudo: membreFromDB.username,
            langue,
            isDispositif: typeContenu === "dispositif"
          });
        }
      } catch (error) {
        logger.info("[sendPublishedTradMailToTraductors] error while sending mail to user", {
          userId: tradId
        });
      }
    });
  } catch (e) {
    logger.info("[sendPublishedTradMailToTraductors] error", e);
  }
};
