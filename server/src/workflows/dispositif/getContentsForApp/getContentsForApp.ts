import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { getTitreInfoOrMarqueInLocale, filterContentsOnGeoloc } from "../../../modules/dispositif/dispositif.adapter";
import { addAgeQuery, addFrenchLevelQuery } from "./functions";

interface Query {
  locale: string;
  age?: string;
  department?: string;
  frenchLevel?: string;
  strictLocation?: boolean | string;
}

const present = (locale: string) => (content: any) => {
  const titreInformatif = getTitreInfoOrMarqueInLocale(content.titreInformatif, locale);
  const titreMarque = getTitreInfoOrMarqueInLocale(content.titreMarque, locale);

  const sponsorUrl =
    content.mainSponsor && content.mainSponsor.picture && content.mainSponsor.picture.secure_url
      ? content.mainSponsor.picture.secure_url
      : null;

  return {
    _id: content._id,
    titreInformatif,
    titreMarque,
    theme: content.theme,
    secondaryThemes: content.secondaryThemes,
    needs: content.needs,
    nbVues: content.nbVues,
    nbVuesMobile: content.nbVuesMobile,
    typeContenu: content.typeContenu,
    sponsorUrl,
    avancement: content.avancement
  };
};

export const getContentsForApp = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.query || !req.query.locale) {
      throw new Error("INVALID_REQUEST");
    }

    const { locale, age, department, frenchLevel } = req.query;

    const strictLocation = req.query.strictLocation === "true" || req.query.strictLocation === "1";

    logger.info("[getContentsForApp] called", {
      locale,
      age,
      department,
      frenchLevel,
      strictLocation
    });

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      avancement: 1,
      contenu: 1,
      theme: 1,
      secondaryThemes: 1,
      needs: 1,
      typeContenu: 1,
      nbVues: 1,
      nbVuesMobile: 1
    };

    const initialQuery = {
      status: "Actif"
    };
    const queryWithAge = addAgeQuery(age, initialQuery);
    const queryWithAgeAndFrenchLevel = addFrenchLevelQuery(frenchLevel, queryWithAge);

    const contentsArray = await getActiveContentsFiltered(neededFields, queryWithAgeAndFrenchLevel);

    const filteredContents = filterContentsOnGeoloc(contentsArray, department, strictLocation);

    const contentsArrayFr = filteredContents.map(present("fr"));

    if (locale === "fr") {
      return res.status(200).json({
        text: "Succès",
        dataFr: contentsArrayFr
      });
    }

    const contentsArrayLocale = filteredContents.map(present(locale));

    res.status(200).json({
      text: "Succès",
      data: contentsArrayLocale,
      dataFr: contentsArrayFr
    });
  } catch (error) {
    logger.error("[getContentsForApp] error while getting dispositifs", {
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
