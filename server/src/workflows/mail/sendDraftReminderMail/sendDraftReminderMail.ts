import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { getDraftDispositifs, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import {
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService
} from "../../../modules/mail/mail.service";
import {
  filterDispositifsForDraftReminders,
  formatDispositifsByCreator,
  FormattedDispositif
} from "../../../modules/dispositif/dispositif.adapter";
import { log } from "./log";

const sendReminderEmails = async (recipient: FormattedDispositif, reminder: "first" | "second") => {
  try {
    if (recipient.dispositifs.length === 1) {
      const dispositifId = recipient.dispositifs[0]._id;
      logger.info(`[sendDraftReminderMail] send mail to ${recipient.email} for dispositif with id ${dispositifId} `);
      await sendOneDraftReminderMailService(
        recipient.email,
        recipient.username,
        recipient.dispositifs[0].titreInformatif,
        recipient.creatorId,
        dispositifId,
        reminder
      );
      const updatedDispositif =
        reminder === "first"
          ? {
            draftReminderMailSentDate: new Date()
          }
          : {
            draftSecondReminderMailSentDate: new Date()
          };
      await updateDispositifInDB(dispositifId, updatedDispositif);
      await log(dispositifId, reminder);
      return;
    }

    logger.info(`[sendDraftReminderMail] send mail to ${recipient.email} for multiple dispositifs`);

    await sendMultipleDraftsReminderMailService(recipient.email, recipient.username, recipient.creatorId, reminder);

    recipient.dispositifs.map(async (dispositif) => {
      const updatedDispositif =
        reminder === "first"
          ? {
            draftReminderMailSentDate: new Date()
          }
          : {
            draftSecondReminderMailSentDate: new Date()
          };
      await updateDispositifInDB(dispositif._id, updatedDispositif);
      await log(dispositif._id, reminder);
    });
    return;
  } catch (error) {
    logger.error("[sendDraftReminderMail] error with the recipient", {
      creatorId: recipient.creatorId
    });
  }
};

export const sendDraftReminderMail = async (): Response => {
  logger.info("[sendDraftReminderMail] received");

  const dispositifs = await getDraftDispositifs();
  logger.info(`[sendDraftReminderMail] ${dispositifs.length} dispositifs in Brouillon`);

  const nbDaysBeforeFirstReminder = 8;
  const dispositifsFirstReminder = filterDispositifsForDraftReminders(
    dispositifs,
    nbDaysBeforeFirstReminder,
    "draftReminderMailSentDate"
  );

  const nbDaysBeforeSecondReminder = 30;
  const dispositifsSecondReminder = filterDispositifsForDraftReminders(
    dispositifs,
    nbDaysBeforeSecondReminder,
    "draftSecondReminderMailSentDate"
  ).filter(
    (dispo) =>
      !dispositifsFirstReminder.find(
        // if dispo in 2 lists, send only first
        (d) => d._id.toString() === dispo._id.toString()
      )
  );

  logger.info(
    `[sendDraftReminderMail] send ${dispositifsFirstReminder.length} 1rst reminders and ${dispositifsSecondReminder.length} 2nd reminders`
  );

  const formattedRecipientsFirstReminder = formatDispositifsByCreator(dispositifsFirstReminder);
  for (const recipient of formattedRecipientsFirstReminder) {
    await sendReminderEmails(recipient, "first");
  }

  const formattedRecipientsSecondReminder = formatDispositifsByCreator(dispositifsSecondReminder);
  for (const recipient of formattedRecipientsSecondReminder) {
    await sendReminderEmails(recipient, "second");
  }

  return { text: "success" }
};
