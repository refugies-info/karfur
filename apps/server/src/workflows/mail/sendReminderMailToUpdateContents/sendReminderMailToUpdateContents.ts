import { asyncForEach } from "~/libs/asyncForEach";
import logger from "~/logger";
import { filterDispositifsForUpdateReminders } from "~/modules/dispositif/dispositif.adapter";
import { getDispositifMainSponsor } from "~/modules/dispositif/dispositif.business";
import {
  getPublishedDispositifWithMainSponsor,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import { sendUpdateReminderMailService } from "~/modules/mail/mail.service";
import { getUserById } from "~/modules/users/users.repository";
import type { Dispositif } from "~/typegoose";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const sendReminderMailToUpdateContents = async (): Response => {
  logger.error("REFACTOR TODO");
  logger.info("[sendReminderMailToUpdateContents] received");

  const dispositifs = await getPublishedDispositifWithMainSponsor();
  logger.info(`[sendReminderMailToUpdateContents] ${dispositifs.length} dispositifs find`);

  const nbDaysBeforeReminder = 90;

  const filteredDispositifs = filterDispositifsForUpdateReminders(
    dispositifs,
    nbDaysBeforeReminder,
  );

  logger.info(
    `[sendReminderMailToUpdateContents] find ${filteredDispositifs.length} reminders to send`,
  );

  const filteredDispositifWithTitreInfoFormated = filteredDispositifs.map((dispo) => ({
    // FIXME ...dispo.toJSON({ flattenMaps: false }),
    ...dispo,
    titreInformatif: dispo.translations.fr.content.titreInformatif,
  }));
  await asyncForEach(
    filteredDispositifWithTitreInfoFormated,
    async (dispositif: Dispositif & { titreInformatif: string }) => {
      try {
        const mainSponsor = getDispositifMainSponsor(dispositif);
        if (mainSponsor) {
          if (mainSponsor.membres) {
            await Promise.all(
              mainSponsor.membres.map(async (membre) => {
                try {
                  const user = await getUserById(membre.userId.toString(), {
                    firstName: 1,
                    email: 1,
                  });
                  if (user.email) {
                    await sendUpdateReminderMailService(
                      user.email,
                      user.firstName,
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
