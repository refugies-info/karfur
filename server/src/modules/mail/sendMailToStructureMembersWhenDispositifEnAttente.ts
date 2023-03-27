import logger from "../../logger";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { isMenSStructure, sendNewFicheEnAttenteMail } from "./mail.service";
import { Dispositif } from "../../typegoose";

export const sendMailToStructureMembersWhenDispositifEnAttente = async (dispositif: Dispositif) => {
  logger.info("[sendMailToStructureMembersWhenDispositifEnAttente] received");
  if (isMenSStructure(dispositif.mainSponsor.toString())) {
    return;
  }
  const structureMembres = await getStructureMembers(dispositif.mainSponsor.toString());
  const membresToSendMail = await getUsersFromStructureMembres(structureMembres);
  const lien = "https://refugies.info/" + dispositif.typeContenu + "/" + dispositif._id.toString();

  return Promise.all(
    membresToSendMail.map((membre) => {
      logger.info("[sendMailToStructureMembersWhenDispositifEnAttente] send mail to membre", {
        membreId: membre._id,
      });
      return sendNewFicheEnAttenteMail({
        pseudo: membre.username,
        titreInformatif: dispositif.translations.fr.content.titreInformatif,
        titreMarque: dispositif.translations.fr.content.titreMarque,
        lien,
        email: membre.email,
        dispositifId: dispositif._id,
        userId: membre._id,
      });
    }),
  );
};
