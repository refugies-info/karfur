/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from "../../logger";
import { asyncForEach } from "../../libs/asyncForEach";
import { getUserById } from "../users/users.repository";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { sendPublishedTradMailToTraductorsService } from "./mail.service";
import { DispositifId } from "../../typegoose";
import { ContentType, UserStatus } from "@refugies-info/api-types";
import { RefactorTodoError } from "../../errors";

// TODO: refactor
export const sendPublishedTradMailToTraductors = async (
  traductorIdsList: string[],
  locale: string,
  typeContenu: ContentType,
  titreInformatif: string | Record<string, string>,
  titreMarque: string | undefined | Record<string, string>,
  dispositifId: DispositifId,
) => {
  logger.info("[sendPublishedTradMailToTraductors] received for language", {
    locale,
  });
  throw new RefactorTodoError();
  // try {
  //   // const titreInformatifFormatted = getTitreInfoOrMarque(titreInformatif);
  //   // const titreMarqueFormatted = getTitreInfoOrMarque(titreMarque);
  //   const langue = getFormattedLocale(locale);
  //   const lien = "https://refugies.info/" + typeContenu + "/" + dispositifId;

  //   await asyncForEach(traductorIdsList, async (tradId) => {
  //     try {
  //       const userNeededFields = {
  //         username: 1,
  //         email: 1,
  //         status: 1,
  //       };

  //       const membreFromDB = await getUserById(tradId, userNeededFields);
  //       if (membreFromDB.status !== UserStatus.DELETED && membreFromDB.email) {
  //         await sendPublishedTradMailToTraductorsService({
  //           dispositifId,
  //           userId: tradId,
  //           titreInformatif: titreInformatifFormatted,
  //           titreMarque: titreMarqueFormatted,
  //           lien,
  //           email: membreFromDB.email,
  //           pseudo: membreFromDB.username,
  //           langue,
  //           isDispositif: typeContenu === ContentType.DISPOSITIF,
  //         });
  //       }
  //     } catch (error) {
  //       logger.info("[sendPublishedTradMailToTraductors] error while sending mail to user", {
  //         userId: tradId,
  //       });
  //     }
  //   });
  // } catch (e) {
  //   logger.info("[sendPublishedTradMailToTraductors] error", e);
  // }
};
