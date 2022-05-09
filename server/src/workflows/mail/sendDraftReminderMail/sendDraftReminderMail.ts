import logger from "logger";
import { RequestFromClient, Res } from "types/interface";
import { isTitreInformatifObject } from "types/typeguards";
import {
  getDraftDispositifs,
  updateDispositifInDB,
} from "modules/dispositif/dispositif.repository";
import {
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
} from "modules/mail/mail.service";
import {
  filterDispositifsForDraftReminders,
  formatDispositifsByCreator,
  FormattedDispositif,
} from "modules/dispositif/dispositif.adapter";
import { checkCronAuthorization } from "libs/checkAuthorizations";
import { DispositifPopulatedDoc } from "schema/schemaDispositif";
import { log } from "./log";

const formatTitle = (dispo: DispositifPopulatedDoc) => {
  if (isTitreInformatifObject(dispo.titreInformatif)) {
    return { ...dispo.toJSON({flattenMaps: false}), titreInformatif: dispo.titreInformatif.fr };
  }
  return { ...dispo.toJSON({flattenMaps: false}), titreInformatif: dispo.titreInformatif };
}

const sendReminderEmails = async (
  recipient: FormattedDispositif,
  reminder: "first" | "second"
) => {
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
        dispositifId,
        reminder
      );
      const updatedDispositif = reminder === "first" ? {
        draftReminderMailSentDate: Date.now(),
      } : {
        draftSecondReminderMailSentDate: Date.now(),
      };
      await updateDispositifInDB(dispositifId, updatedDispositif);
      await log(dispositifId, reminder);
      return;
    }

    logger.info(
      `[sendDraftReminderMail] send mail to ${recipient.email} for multiple dispositifs`
    );

    await sendMultipleDraftsReminderMailService(
      recipient.email,
      recipient.username,
      recipient.creatorId,
      reminder
    );

    recipient.dispositifs.map(
      async (dispositif) => {
        const updatedDispositif = reminder === "first" ? {
          draftReminderMailSentDate: Date.now(),
        } : {
          draftSecondReminderMailSentDate: Date.now(),
        };
        await updateDispositifInDB(dispositif._id, updatedDispositif);
        await log(dispositif._id, reminder);
      }
    );
    return;
  } catch (error) {
    logger.error("[sendDraftReminderMail] error with the recipient", {
      creatorId: recipient.creatorId,
    });
  }
}

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
    ).filter(dispo => !dispositifsFirstReminder.find( // if dispo in 2 lists, send only first
      d => d._id.toString() === dispo._id.toString()
    ));

    logger.info(
      `[sendDraftReminderMail] send ${dispositifsFirstReminder.length} 1rst reminders and ${dispositifsSecondReminder.length} 2nd reminders`
    );

    const dispositifsFirstReminderWithFormattedTitle = dispositifsFirstReminder.map((dispo) => formatTitle(dispo));
    const formattedRecipientsFirstReminder = formatDispositifsByCreator(dispositifsFirstReminderWithFormattedTitle);
    for (const recipient of formattedRecipientsFirstReminder) {
      await sendReminderEmails(recipient, "first");
    }

    const dispositifsSecondReminderWithFormattedTitle = dispositifsSecondReminder.map((dispo) => formatTitle(dispo));
    const formattedRecipientsSecondReminder = formatDispositifsByCreator(dispositifsSecondReminderWithFormattedTitle);
    for (const recipient of formattedRecipientsSecondReminder) {
      await sendReminderEmails(recipient, "second");
    }

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
