import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { sendPublishedMailToStructureMembers, sendPublishedMailToCreator } from "./mailFunctions";
import logger from "../../logger";
import { Dispositif } from "src/typegoose";

export const sendMailWhenDispositifPublished = async (dispo: Dispositif) => {
  logger.info("[sendMailWhenDispositifPublished] received");
  const structureMembres = await getStructureMembers(dispo.mainSponsor.toString());
  const membresToSendMail = await getUsersFromStructureMembres(structureMembres);

  const titreInformatif = dispo.translations.fr.content.titreInformatif;
  const titreMarque = dispo.translations.fr.content.titreMarque;
  const lien = "https://refugies.info/" + dispo.typeContenu + "/" + dispo._id;

  await sendPublishedMailToStructureMembers(membresToSendMail, titreInformatif, titreMarque, lien, dispo._id);
  const isCreatorInStructure =
    structureMembres.filter((membre) => membre.userId.toString() === dispo.creatorId.toString()).length > 0;

  if (!isCreatorInStructure) {
    logger.info("[sendMailWhenDispositifPublished] creator is not in structure");
    return await sendPublishedMailToCreator(dispo, titreInformatif, titreMarque, lien);
  }
  logger.info("[sendMailWhenDispositifPublished] creator is in structure");

  return;
};
