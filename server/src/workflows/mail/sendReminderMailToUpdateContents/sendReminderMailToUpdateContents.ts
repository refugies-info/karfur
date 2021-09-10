/* eslint-disable no-console */
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getPublishedDispositifWithMainSponsor } from "../../../modules/dispositif/dispositif.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import { filterDispositifsForUpdateReminders } from "../../../modules/dispositif/dispositif.adapter";
import { sendUpdateReminderMailService } from "../../../modules/mail/mail.service";
// import { isTitreInformatifObject } from "../../../types/typeguards";

export const sendReminderMailToUpdateContents = async (
  req: RequestFromClient<{ cronToken: string }>,
  res: Res
) => {
  try {
    logger.info("[sendReminderMailToUpdateContents] received");

    checkCronAuthorization(req.body.query && req.body.query.cronToken);

    const dispositifs = await getPublishedDispositifWithMainSponsor();
    logger.info(
      `[sendReminderMailToUpdateContents] ${dispositifs.length} dispositifs find`
    );

    logger.info(
      `[sendReminderMailToUpdateContents] ${dispositifs[0]} dispositifs find`
    );

    const nbDaysBeforeReminder = 90;

    const filteredDispositifs = filterDispositifsForUpdateReminders(
      //@ts-ignore
      dispositifs,
      nbDaysBeforeReminder
    );

    logger.info(
      `[sendReminderMailToUpdateContents] find ${filteredDispositifs.length} reminders to send`
    );

    filteredDispositifs.forEach((dispositif) => {
      if (dispositif.mainSponsor) {
        //@ts-ignore
        if (dispositif.mainSponsor.membres) {
          //@ts-ignore
          dispositif.mainSponsor.membres.forEach(async (membre) => {
            if (membre.roles[0] === "administrateur") {
              let user = await getUserById(membre.userId, {
                username: 1,
                email: 1,
              });
              if (user.email) {
                sendUpdateReminderMailService(
                  user.email,
                  user.username,
                  //@ts-ignore
                  dispositif.titreInformatif,
                  user._id,
                  dispositif._id,
                  "https://refugies.info/" +
                    dispositif.typeContenu +
                    "/" +
                    dispositif._id
                );
              }
            }
          });
        }
      }
    });

    // logger.info(
    //   `[sendReminderMailToUpdateContents] send ${filteredDispositif} reminders`
    // );
    // const formattedRecipients = formatDispositifsByCreator(
    //   dispositifsWithFormattedTitle
    // );

    // await asyncForEach(formattedRecipients, async (recipient) => {
    //   try {
    //     if (recipient.dispositifs.length === 1) {
    //       const dispositifId = recipient.dispositifs[0]._id;
    //       logger.info(
    //         `[sendReminderMailToUpdateContents] send mail to ${recipient.email} for dispositif with id ${dispositifId} `
    //       );
    //       await sendOneDraftReminderMailService(
    //         recipient.email,
    //         recipient.username,
    //         recipient.dispositifs[0].titreInformatif,
    //         recipient.creatorId,
    //         dispositifId
    //       );
    //       await updateDispositifInDB(dispositifId, {
    //         draftReminderMailSentDate: Date.now(),
    //       });
    //       return;
    //     }

    //     logger.info(
    //       `[sendReminderMailToUpdateContents] send mail to ${recipient.email} for multiple dispositifs`
    //     );

    //     await sendMultipleDraftsReminderMailService(
    //       recipient.email,
    //       recipient.username,
    //       recipient.creatorId
    //     );

    //     recipient.dispositifs.map(
    //       async (dispositif) =>
    //         await updateDispositifInDB(dispositif._id, {
    //           draftReminderMailSentDate: Date.now(),
    //         })
    //     );
    //   } catch (error) {
    //     logger.error(
    //       "[sendReminderMailToUpdateContents] error with the recipient",
    //       {
    //         creatorId: recipient.creatorId,
    //       }
    //     );
    //   }
    // });

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendReminderMailToUpdateContents] error", {
      error: error.message,
    });
    switch (error.message) {
      case "NOT_AUTHORIZED":
        return res.status(404).json({ text: "Non authorisé" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
