import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import {
  getDraftDispositifs,
  updateDispositifInDB,
} from "../../../controllers/dispositif/dispositif.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import moment from "moment";
import { sendOneDraftReminderMailService } from "../../../modules/mail/mail.service";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";

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

    await asyncForEach(dispositifs, async (dispositif) => {
      try {
        logger.info(
          `[sendDraftReminderMail] dispositif with id ${dispositif._id} `
        );

        if (dispositif.draftReminderMailSentDate) {
          logger.info(
            `[sendDraftReminderMail] dispositif with id ${dispositif._id} has already received reminder `
          );
          return;
        }

        const lastUpdate =
          dispositif.lastModificationDate || dispositif.updatedAt;
        const nbDaysFromNow = Math.round(
          moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24)
        );
        if (nbDaysFromNow < nbDaysBeforeReminder) {
          logger.info(
            `[sendDraftReminderMail] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} ago`
          );
          return;
        }

        // @ts-ignore populate creatorId
        if (!dispositif.creatorId.email) {
          logger.info(
            `[sendDraftReminderMail] dispositif with id ${dispositif._id}, creator has no email related`
          );
          return;
        }

        logger.info(
          `[sendDraftReminderMail] dispositif with id ${dispositif._id} has not been updated since ${nbDaysFromNow} days, send a mail`
        );

        await sendOneDraftReminderMailService(
          // @ts-ignore populate creatorId
          dispositif.creatorId.email,
          // @ts-ignore populate creatorId
          dispositif.creatorId.username,
          // @ts-ignore
          dispositif.titreInformatif,
          // @ts-ignore populate creatorId
          dispositif.creatorId._id,
          dispositif._id
        );
        await updateDispositifInDB(dispositif._id, {
          draftReminderMailSentDate: Date.now(),
        });
      } catch (error) {
        logger.error("[sendDraftReminderMail] error with the dispositif", {
          dispositifId: dispositif._id,
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
