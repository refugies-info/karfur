import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifByIdWithMainSponsor } from "../../../modules/dispositif/dispositif.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

import { turnToLocalized, turnJSONtoHTML } from "../../../controllers/dispositif/functions";
import { DispositifId } from "src/typegoose";

interface Query {
  locale: string;
  contentId: DispositifId;
}

export const getContentById = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.query || !req.query.locale || !req.query.contentId) {
      throw new Error("INVALID_REQUEST");
    }

    const { locale, contentId } = req.query;

    logger.info("[getContentById] called", {
      locale,
      contentId
    });

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      avancement: 1,
      contenu: 1,
      theme: 1,
      secondaryThemes: 1,
      typeContenu: 1,
      externalLink: 1,
      lastModificationDate: 1,
      nbVuesMobile: 1,
      nbFavoritesMobile: 1
    };

    const content = await getDispositifByIdWithMainSponsor(contentId, neededFields);

    const mainSponsor = content.getMainSponsor();
    const sponsor = mainSponsor ? { picture: mainSponsor.picture, nom: mainSponsor.nom } : null;

    // @ts-ignore FIXME
    content.mainSponsor = sponsor;

    logger.error("REFACTOR TODO");
    // TODO turnToLocalized(content, locale);
    // FIXME turnJSONtoHTML(content.contenu);

    res.status(200).json({
      text: "Succès",
      data: content
    });
  } catch (error) {
    logger.error("[getContentById] error while getting dispositif", {
      error: error.message
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({
          text: "Erreur interne"
        });
    }
  }
};
