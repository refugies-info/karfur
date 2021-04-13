import { DispositifNotPopulateDoc } from "../../schema/schemaDispositif";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { getTitreInfoOrMarque } from "../dispositif/dispositif.adapter";
import {
  sendPublishedMailToStructureMembers,
  sendPublishedMailToCreator,
} from "../dispositif/dispositif.mail.service";

export const sendMailWhenDispositifPublished = async (
  dispo: DispositifNotPopulateDoc
) => {
  const structureMembres = await getStructureMembers(dispo.mainSponsor);
  const membresToSendMail = await getUsersFromStructureMembres(
    structureMembres
  );
  const titreInformatif = getTitreInfoOrMarque(dispo.titreInformatif);
  const titreMarque = getTitreInfoOrMarque(dispo.titreMarque);
  const lien = "https://refugies.info/" + dispo.typeContenu + "/" + dispo._id;

  await sendPublishedMailToStructureMembers(
    membresToSendMail,
    titreInformatif,
    titreMarque,
    lien,
    dispo._id
  );
  const isCreatorInStructure = structureMembres.filter(
    (membre) => membre.userId.toString() === dispo.creatorId.toString()
  );

  if (!isCreatorInStructure) {
    await sendPublishedMailToCreator(dispo, titreInformatif, titreMarque, lien);
  }
};
