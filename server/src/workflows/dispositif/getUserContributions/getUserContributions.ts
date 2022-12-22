import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { getDispositifsWithCreatorId } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";

export const getUserContributions = async (req: RequestFromClient<{}>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    logger.info("getUserContributions received");
    const userId = req.userId;

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      typeContenu: 1,
      mainSponsor: 1,
      nbVues: 1,
      status: 1,
      merci: 1
    };
    const dispositifs = await getDispositifsWithCreatorId(userId, neededFields);
    const adaptedDispositifs = dispositifs.map((dispo) => {
      turnToLocalizedTitles(dispo, "fr");
      const jsonDispo = dispo.toJSON();
      const formattedDispo = {
        ...jsonDispo,
        // @ts-ignore populate mainSponsor
        mainSponsor: jsonDispo.mainSponsor ? jsonDispo.mainSponsor.nom : null,
        nbMercis: jsonDispo.merci ? jsonDispo.merci.length : 0
      };

      // @ts-ignore
      delete formattedDispo.merci;
      return formattedDispo;
    });
    return res.status(200).json({ data: adaptedDispositifs });
  } catch (error) {
    logger.info("getUserContributions error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
