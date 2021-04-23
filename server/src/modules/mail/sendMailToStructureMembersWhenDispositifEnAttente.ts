import { ObjectId } from "mongoose";
import logger from "../../logger";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { getTitreInfoOrMarque } from "../dispositif/dispositif.adapter";
import { asyncForEach } from "../../libs/asyncForEach";
import { sendNewFicheEnAttenteMail } from "./mail.service";

export const sendMailToStructureMembersWhenDispositifEnAttente = async (
  sponsorId: ObjectId,
  dispositifId: ObjectId,
  titreInformatif: string,
  titreMarque: string,
  typeContenu: "dispositif"
) => {
  logger.info("[sendMailToStructureMembersWhenDispositifEnAttente] received");
  const structureMembres = await getStructureMembers(sponsorId);
  const membresToSendMail = await getUsersFromStructureMembres(
    structureMembres
  );
  const titreInformatifFormatted = getTitreInfoOrMarque(titreInformatif);
  const titreMarqueFormatted = getTitreInfoOrMarque(titreMarque);
  const lien = "https://refugies.info/" + typeContenu + "/" + dispositifId;

  await asyncForEach(membresToSendMail, async (membre) => {
    logger.info(
      "[sendMailToStructureMembersWhenDispositifEnAttente] send mail to membre",
      {
        membreId: membre._id,
      }
    );
    await sendNewFicheEnAttenteMail({
      pseudo: membre.username,
      titreInformatif: titreInformatifFormatted,
      titreMarque: titreMarqueFormatted,
      lien,
      email: membre.email,
      dispositifId,
      userId: membre._id,
    });
  });
};
