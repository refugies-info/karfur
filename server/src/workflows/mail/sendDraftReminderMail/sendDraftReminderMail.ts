import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import {
  getDraftDispositifs,
  updateDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import {
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
} from "../../../modules/mail/mail.service";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import {
  filterDispositifsForDraftReminders,
  formatDispositifsByCreator,
} from "../../../modules/dispositif/dispositif.adapter";
import { isTitreInformatifObject } from "../../../types/typeguards";

export const sendDraftReminderMail = async (
  req: RequestFromClient<{ cronToken: string }>,
  res: Res
) => {
  try {
    logger.info("[sendDraftReminderMail] received");

    checkCronAuthorization(req.body.query && req.body.query.cronToken);

    const dispositifs = await getDraftDispositifs();
    logger.info(
      `[sendDraftReminderMail] ${dispositifs.length} dispositifs in Brouillon`
    );

    const nbDaysBeforeReminder = 8;

    const filteredDispositifs = filterDispositifsForDraftReminders(
      dispositifs,
      nbDaysBeforeReminder
    );

    logger.info(
      `[sendDraftReminderMail] send ${filteredDispositifs.length} reminders`
    );

    const dispositifsWithFormattedTitle = filteredDispositifs.map((dispo) => {
      if (isTitreInformatifObject(dispo.titreInformatif)) {
        return { ...dispo.toJSON(), titreInformatif: dispo.titreInformatif.fr };
      }
      return { ...dispo.toJSON(), titreInformatif: dispo.titreInformatif };
    });

    const formattedRecipients = formatDispositifsByCreator(
      dispositifsWithFormattedTitle
    );

    await asyncForEach(formattedRecipients, async (recipient) => {
      try {
        if (recipient.dispositifs.length === 1) {
          const dispositifId = recipient.dispositifs[0]._id;
          logger.info(
            `[sendDraftReminderMail] send mail to ${recipient.email} for dispositif with id ${dispositifId} `
          );
          await sendOneDraftReminderMailService(
            recipient.email,
            recipient.username,
            recipient.dispositifs[0].titreInformatif,
            recipient.creatorId,
            dispositifId
          );
          await updateDispositifInDB(dispositifId, {
            draftReminderMailSentDate: Date.now(),
          });
          return;
        }

        logger.info(
          `[sendDraftReminderMail] send mail to ${recipient.email} for multiple dispositifs`
        );

        await sendMultipleDraftsReminderMailService(
          recipient.email,
          recipient.username,
          recipient.creatorId
        );

        recipient.dispositifs.map(
          async (dispositif) =>
            await updateDispositifInDB(dispositif._id, {
              draftReminderMailSentDate: Date.now(),
            })
        );
      } catch (error) {
        logger.error("[sendDraftReminderMail] error with the recipient", {
          creatorId: recipient.creatorId,
        });
      }
    });

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendDraftReminderMail] error", { error: error.message });
    switch (error.message) {
      case "NOT_AUTHORIZED":
        return res.status(404).json({ text: "Non authorisé" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
