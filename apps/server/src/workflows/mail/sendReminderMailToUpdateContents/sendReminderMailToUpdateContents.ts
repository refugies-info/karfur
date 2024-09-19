import { asyncForEach } from "~/libs/asyncForEach";
import logger from "~/logger";
import { filterDispositifsForUpdateReminders } from "~/modules/dispositif/dispositif.adapter";
import {
  getPublishedDispositifWithMainSponsor,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import { sendUpdateReminderMailService } from "~/modules/mail/mail.service";
import { getUserById } from "~/modules/users/users.repository";
import { Dispositif } from "~/typegoose";
import { Response } from "~/types/interface";
import { log } from "./log";

export const sendReminderMailToUpdateContents = async (): Response => {
  logger.error("REFACTOR TODO");
  logger.info("[sendReminderMailToUpdateContents] received");

  const dispositifs = await getPublishedDispositifWithMainSponsor();
  logger.info(`[sendReminderMailToUpdateContents] ${dispositifs.length} dispositifs find`);

  const nbDaysBeforeReminder = 90;

  const filteredDispositifs = filterDispositifsForUpdateReminders(dispositifs, nbDaysBeforeReminder);

  logger.info(`[sendReminderMailToUpdateContents] find ${filteredDispositifs.length} reminders to send`);

  const filteredDispositifWithTitreInfoFormated = filteredDispositifs.map((dispo) => ({
    // FIXME ...dispo.toJSON({ flattenMaps: false }),
    ...dispo,
    titreInformatif: dispo.translations.fr.content.titreInformatif,
  }));
  await asyncForEach(
    filteredDispositifWithTitreInfoFormated,
    async (dispositif: Dispositif & { titreInformatif: string }) => {
      try {
        if (dispositif.mainSponsor) {
          if (dispositif.getMainSponsor().membres) {
            await Promise.all(
              dispositif.getMainSponsor().membres.map(async (membre) => {
                try {
                  let user = await getUserById(membre.userId.toString(), {
                    username: 1,
                    email: 1,
                  });
                  if (user.email) {
                    await sendUpdateReminderMailService(
                      user.email,
                      user.username,
                      dispositif.titreInformatif,
                      user._id,
                      dispositif._id,
                      "https://refugies.info/" + dispositif.typeContenu + "/" + dispositif._id,
                    );

                    await updateDispositifInDB(dispositif._id, {
                      lastReminderMailSentToUpdateContentDate: new Date(),
                    });
                  }
                } catch (e) {
                  logger.error("[sendReminderMailToUpdateContents] error while sending mail", e);
                }
              }),
            );
          }
        }
        await log(dispositif._id);
      } catch (error) {
        logger.error("[sendReminderMailToUpdateContents] error", {
          error: error.message,
        });
      }
    },
  );
  return { text: "success" };
};
