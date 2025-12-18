import logger from "~/logger";
import type { Dispositif } from "~/typegoose";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import {
  sendPublishedMailToCreator,
  sendPublishedMailToStructureMembers,
  sendValidatedAndPublishedMail,
} from "./mailFunctions";

export const sendMailWhenDispositifPublished = async (dispo: Dispositif) => {
  logger.info("[sendMailWhenDispositifPublished] received");
  const structureMembres = await getStructureMembers(dispo.mainSponsor.toString());
  const membresToSendMail = await getUsersFromStructureMembres(structureMembres);

  const titreInformatif = dispo.translations.fr.content.titreInformatif;
  const titreMarque = dispo.translations.fr.content.titreMarque;
  const lien = "https://refugies.info/" + dispo.typeContenu + "/" + dispo._id;

  void sendPublishedMailToStructureMembers(
    membresToSendMail,
    titreInformatif,
    titreMarque,
    lien,
    dispo._id,
  );
  const isCreatorInStructure =
    structureMembres.filter((membre) => membre.userId.toString() === dispo.creatorId.toString())
      .length > 0;

  if (!isCreatorInStructure) {
    logger.info("[sendMailWhenDispositifPublished] creator is not in structure");
    return await sendPublishedMailToCreator(dispo, titreInformatif, titreMarque, lien);
  }
  logger.info("[sendMailWhenDispositifPublished] creator is in structure");

  return;
};

export const sendMailWhenDispositifPublishedAfterUpdate = async (dispo: Dispositif) => {
  logger.info("[sendMailWhenDispositifPublishedAfterUpdate] received");
  const structureMembres = await getStructureMembers(dispo.mainSponsor.toString());
  const membresToSendMail = await getUsersFromStructureMembres(structureMembres);

  const titreInformatif = dispo.translations.fr.content.titreInformatif;
  const titreMarque = dispo.translations.fr.content.titreMarque;
  const lien = "https://refugies.info/" + dispo.typeContenu + "/" + dispo._id;

  return sendValidatedAndPublishedMail(membresToSendMail, titreInformatif, titreMarque, lien);
};
