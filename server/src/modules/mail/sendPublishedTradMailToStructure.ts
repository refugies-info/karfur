import { getStructureMembers } from "../structure/structure.service";
import { getUsersFromStructureMembres } from "../users/users.service";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { asyncForEach } from "../../libs/asyncForEach";
import logger from "../../logger";
import { sendPublishedTradMailToStructureService } from "./mail.service";
import { Dispositif } from "src/typegoose";

export const sendPublishedTradMailToStructure = async (dispositif: Dispositif, locale: string) => {
  try {
    logger.info("[sendPublishedTradMailToStructureService] received");
    const structureMembres = await getStructureMembers(dispositif.mainSponsor.toString());
    const membresToSendMail = await getUsersFromStructureMembres(structureMembres);

    const langue = getFormattedLocale(locale);

    await asyncForEach(membresToSendMail, async (membre) => {
      logger.info("[sendPublishedTradMailToStructureService] send mail to membre", {
        membreId: membre._id
      });
      try {
        await sendPublishedTradMailToStructureService({
          pseudo: membre.username,
          titreInformatif: dispositif.translations.fr.content.titreInformatif,
          titreMarque: dispositif.translations.fr.content.titreMarque,
          lien: "https://refugies.info/" + dispositif.type + "/" + dispositif._id,
          email: membre.email,
          dispositifId: dispositif._id,
          userId: membre._id,
          langue
        });
      } catch (e) {
        logger.error("[sendPublishedTradMailToStructureService] Error while sending mail", e);
      }
    });
  } catch (e) {
    logger.error("[sendPublishedTradMailToStructureService] Error ", e);
  }
};
