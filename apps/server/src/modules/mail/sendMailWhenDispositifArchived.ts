import logger from "~/logger";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";
import { sendFicheArchivedService } from "~/modules/mail/mail.service";
import { Dispositif } from "~/typegoose";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";

export const sendMailWhenDispositifArchived = async (dispositifId: Dispositif["_id"]) => {
  logger.info("[sendMailWhenDispositifArchived] received");
  const dispositif = await getDispositifById(dispositifId);
  const structureMembres = await getStructureMembers(dispositif.mainSponsor.toString());
  const membresToSendMail = await getUsersFromStructureMembres(structureMembres);

  const titreInformatif = dispositif.translations.fr.content.titreInformatif;
  const titreMarque = dispositif.translations.fr.content.titreMarque;
  const lien = "https://refugies.info/" + dispositif.typeContenu + "/" + dispositif._id;

  await Promise.all(
    membresToSendMail.map((membre) => {
      logger.info("[sendMailWhenDispositifArchived] send mail to membre", {
        membreId: membre._id,
      });
      return sendFicheArchivedService(membre.email, {
        firstName: membre.firstName || "",
        lien,
        titreInformatif,
        titreMarque,
      });
    }),
  );

  return;
};
