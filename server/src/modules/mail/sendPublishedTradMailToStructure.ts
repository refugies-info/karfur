import { DispositifDoc } from "../../schema/schemaDispositif";
import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { getTitreInfoOrMarque } from "../dispositif/dispositif.adapter";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { asyncForEach } from "../../libs/asyncForEach";
import logger = require("../../logger");
import { sendPublishedTradMailToStructureService } from "./mail.service";

export const sendPublishedTradMailToStructure = async (
  dispositif: DispositifDoc,
  locale: string
) => {
  const structureMembres = await getStructureMembers(dispositif.mainSponsor);
  const membresToSendMail = await getUsersFromStructureMembres(
    structureMembres
  );

  const titreInformatif = getTitreInfoOrMarque(dispositif.titreInformatif);
  const titreMarque = getTitreInfoOrMarque(dispositif.titreMarque);
  const langue = getFormattedLocale(locale);

  await asyncForEach(membresToSendMail, async (membre) => {
    logger.info(
      "[sendPublishedTradMailToStructureService] send mail to membre",
      {
        membreId: membre._id,
      }
    );
    await sendPublishedTradMailToStructureService({
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
      langue,
    });
  });
};
