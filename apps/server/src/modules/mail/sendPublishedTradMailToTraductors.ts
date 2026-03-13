import { ContentType, type Languages, UserStatus } from "@refugies-info/api-types";
import type { Dispositif, User } from "@refugies-info/mongo";
import { uniq } from "lodash";
import type { ProjectionType } from "mongoose";
import { getFormattedLocale } from "~/libs/getFormattedLocale";
import logger from "~/logger";
import { findTraductors } from "../traductions/traductions.repository";
import { getUserById } from "../users/users.repository";
import { sendPublishedTradMailToTraductorsService } from "./mail.service";

export const sendPublishedTradMailToTraductors = async (
  locale: Languages,
  dispositif: Dispositif,
) => {
  logger.info("[sendPublishedTradMailToTraductors] received for language", {
    locale,
  });
  try {
    const langue = getFormattedLocale(locale);
    const lien =
      "https://refugies.info/" + dispositif.typeContenu + "/" + dispositif._id.toString();
    const allTraductors = await findTraductors(dispositif._id, locale);
    const traductors = uniq(
      allTraductors.map((t: (typeof allTraductors)[number]) => t.userId.toString()),
    );
    await Promise.all(
      traductors.map(async (tradId) => {
        try {
          const userNeededFields: ProjectionType<User> = {
            firstName: 1,
            email: 1,
            status: 1,
          };

          const membreFromDB = await getUserById(tradId, userNeededFields);
          if (membreFromDB.status !== UserStatus.DELETED && membreFromDB.email) {
            await sendPublishedTradMailToTraductorsService({
              dispositifId: dispositif._id.toString(),
              userId: tradId as string,
              titreInformatif: dispositif.translations.fr.content.titreInformatif,
              titreMarque: dispositif.translations.fr.content.titreMarque,
              lien,
              email: membreFromDB.email,
              firstName: membreFromDB.firstName,
              langue,
              isDispositif: dispositif.typeContenu === ContentType.DISPOSITIF,
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          logger.info("[sendPublishedTradMailToTraductors] error while sending mail to user", {
            userId: tradId,
          });
        }
      }),
    );
  } catch (e) {
    logger.info("[sendPublishedTradMailToTraductors] error", e);
  }
};
