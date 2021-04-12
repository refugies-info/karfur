import {
  DispositifNotPopulateDoc,
  DispositifDoc,
} from "../../schema/schemaDispositif";
import { getUserById } from "../users/users.repository";
import logger from "../../logger";
import {
  sendPublishedFicheMail,
  sendPublishedTradMailToStructure,
} from "../mail/mail.service";
import { getStructureFromDB } from "../structure/structure.repository";
import { asyncForEach } from "../../libs/asyncForEach";
import { getTitreInfoOrMarque } from "./dispositif.adapter";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";

export const sendPublishedMailToCreator = async (
  newDispo: DispositifNotPopulateDoc
) => {
  const userNeededFields = {
    username: 1,
    email: 1,
    status: 1,
  };

  const creator = await getUserById(newDispo.creatorId, userNeededFields);
  if (creator.status === "Exclu") return;
  if (creator.email) {
    logger.info("[publish dispositif] creator has email");
    const titreInformatif = getTitreInfoOrMarque(newDispo.titreInformatif);
    const titreMarque = getTitreInfoOrMarque(newDispo.titreMarque);
    await sendPublishedFicheMail({
      pseudo: creator.username,
      titreInformatif: titreInformatif,
      titreMarque: titreMarque,
      lien:
        "https://refugies.info/" + newDispo.typeContenu + "/" + newDispo._id,
      email: creator.email,
      dispositifId: newDispo._id,
      userId: creator._id,
    });
  }
};

export const sendPublishedMailToStructureMembers = async (
  newDispo: DispositifNotPopulateDoc
) => {
  const userNeededFields = {
    username: 1,
    email: 1,
    status: 1,
  };
  const structureNeededFields = { membres: 1 };
  const structure = await getStructureFromDB(
    newDispo.mainSponsor,
    false,
    structureNeededFields
  );

  if (!structure || !structure.membres || structure.membres.length === 0) {
    return;
  }
  const titreInformatif = getTitreInfoOrMarque(newDispo.titreInformatif);
  const titreMarque = getTitreInfoOrMarque(newDispo.titreMarque);
  await asyncForEach(structure.membres, async (membre) => {
    if (!membre.userId) return;
    if (membre.userId.toString() === newDispo.creatorId.toString()) {
      return;
    }
    const membreFromDB = await getUserById(membre.userId, userNeededFields);
    if (membreFromDB.status === "Exclu") return;
    if (!membreFromDB.email) return;

    logger.info("[publish dispositif] send mail to membre", {
      membreId: membreFromDB._id,
    });
    await sendPublishedFicheMail({
      pseudo: membreFromDB.username,
      titreInformatif: titreInformatif,
      titreMarque: titreMarque,
      lien:
        "https://refugies.info/" + newDispo.typeContenu + "/" + newDispo._id,
      email: membreFromDB.email,
      dispositifId: newDispo._id,
      userId: membreFromDB._id,
    });
  });
};

export const sendPublishedTradMailToStructureService = async (
  dispositif: DispositifDoc,
  locale: string
) => {
  const structureMembres = await getStructureMembers(dispositif.mainSponsor);

  const membresToSendMail = await getUsersFromStructureMembres(
    structureMembres
  );

  const titreInformatif = getTitreInfoOrMarque(dispositif.titreInformatif);
  const titreMarque = getTitreInfoOrMarque(dispositif.titreMarque);

  await asyncForEach(membresToSendMail, async (membre) => {
    logger.info("[publish trad] send mail to membre", {
      membreId: membre._id,
    });
    await sendPublishedTradMailToStructure({
      pseudo: membre.username,
      titreInformatif: titreInformatif,
      titreMarque: titreMarque,
      lien:
        "https://refugies.info/" +
        dispositif.typeContenu +
        "/" +
        dispositif._id,
      email: membre.email,
      dispositifId: dispositif._id,
      userId: membre._id,
      langue: locale,
    });
  });
};
