import logger from "../../../logger";
import { RequestFromClient, Res } from "../../../types/interface";
import { isTitreInformatifObject } from "../../../types/typeguards";
import { Membre } from "../../../types/interface";
import {
  getPublishedDispositifWithMainSponsor,
  updateDispositifInDB
} from "../../../modules/dispositif/dispositif.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { filterDispositifsForUpdateReminders } from "../../../modules/dispositif/dispositif.adapter";
import { sendUpdateReminderMailService } from "../../../modules/mail/mail.service";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import { asyncForEach } from "../../../libs/asyncForEach";
import { log } from "./log";
import { isMenSStructure } from "../../../connectors/sendgrid/sendMail";

export const sendReminderMailToUpdateContents = async (req: RequestFromClient<{ cronToken: string }>, res: Res) => {
  try {
    logger.info("[sendReminderMailToUpdateContents] received");

    checkCronAuthorization(req.body.query && req.body.query.cronToken);

    const dispositifs = await getPublishedDispositifWithMainSponsor();
    logger.info(`[sendReminderMailToUpdateContents] ${dispositifs.length} dispositifs find`);

    const nbDaysBeforeReminder = 90;

    const filteredDispositifs = filterDispositifsForUpdateReminders(dispositifs, nbDaysBeforeReminder);

    logger.info(`[sendReminderMailToUpdateContents] find ${filteredDispositifs.length} reminders to send`);

    const filteredDispositifWithTitreInfoFormated = filteredDispositifs.map((dispo) => {
      if (isTitreInformatifObject(dispo.titreInformatif)) {
        return {
          ...dispo.toJSON({ flattenMaps: false }),
          titreInformatif: dispo.titreInformatif.fr
        };
      }
      return { ...dispo.toJSON({ flattenMaps: false }), titreInformatif: dispo.titreInformatif };
    });
    await asyncForEach(filteredDispositifWithTitreInfoFormated, async (dispositif) => {
      try {
        // @ts-ignore
        if (dispositif.mainSponsor && !isMenSStructure(dispositif.mainSponsor.toString())) {
          //@ts-ignore
          if (dispositif.mainSponsor.membres) {
            await asyncForEach(
              //@ts-ignore
              dispositif.mainSponsor.membres,
              async (membre: Membre) => {
                try {
                  if (membre.roles.includes("administrateur")) {
                    let user = await getUserById(membre.userId, {
                      username: 1,
                      email: 1
                    });
                    if (user.email) {
                      await sendUpdateReminderMailService(
                        user.email,
                        user.username,
                        dispositif.titreInformatif,
                        user._id,
                        // @ts-ignore
                        dispositif._id,
                        "https://refugies.info/" +
                          // @ts-ignore
                          dispositif.typeContenu +
                          "/" +
                          // @ts-ignore
                          dispositif._id
                      );

                      // @ts-ignore
                      await updateDispositifInDB(dispositif._id, {
                        lastReminderMailSentToUpdateContentDate: Date.now()
                      });
                    }
                  }
                } catch (e) {
                  logger.error("[sendReminderMailToUpdateContents] error while sending mail", e);
                }
              }
            );
          }
        }
        // @ts-ignore
        await log(dispositif._id);
      } catch (error) {
        logger.error("[sendReminderMailToUpdateContents] error", {
          error: error.message
        });
      }
    });
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendReminderMailToUpdateContents] error", {
      error: error.message
    });
    switch (error.message) {
      case "NOT_AUTHORIZED":
        return res.status(404).json({ text: "Non authorisé" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
