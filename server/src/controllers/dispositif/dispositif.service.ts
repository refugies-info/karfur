const logger = require("../../logger");
import {
  turnToLocalized,
  turnJSONtoHTML,
  turnToLocalizedTitles,
} from "./functions";
import { Res, RequestFromClient, IDispositif } from "../../types/interface";
import {
  getDispositifsFromDB,
  getDispositifArray,
  updateDispositifInDB,
  getActiveDispositifsFromDBWithoutPopulate,
} from "./dispositif.repository";
import { ObjectId } from "mongoose";
import { updateAssociatedDispositifsInStructure } from "../../modules/structure/structure.repository";
import {
  removeUselessContent,
  adaptDispositifMainSponsorAndCreatorId,
  adaptDispositifDepartement,
  getRegionFigures,
} from "./dispositif.adapter";
import { updateLanguagesAvancement } from "../langues/langues.service";

interface Query {}

export const getDispositifs = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    if (!req.body || !req.body.query) {
      res.status(400).json({ text: "Requête invalide" });
    } else {
      logger.info("[getDispositifs] called");
      let { query, locale } = req.body;
      locale = locale || "fr";

      const dispositifArray = await getDispositifArray(query);

      // @ts-ignore
      const adaptedDispositifArray = removeUselessContent(dispositifArray);
      const array: string[] = [];
      array.forEach.call(adaptedDispositifArray, (dispositif: IDispositif) => {
        turnToLocalized(dispositif, locale);
        turnJSONtoHTML(dispositif.contenu);
      });

      res.status(200).json({
        text: "Succès",
        data: adaptedDispositifArray,
      });
    }
  } catch (error) {
    logger.error("[getDispositifs] error while getting dispositifs", {
      error: error.message,
    });
    switch (error) {
      case 500:
        res.status(500).json({
          text: "Erreur interne",
        });
        break;
      case 404:
        res.status(404).json({
          text: "Pas de résultat",
        });
        break;
      default:
        res.status(500).json({
          text: "Erreur interne",
        });
    }
  }
};

export const getAllDispositifs = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllDispositifs] called");

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      updatedAt: 1,
      status: 1,
      typeContenu: 1,
      created_at: 1,
      publishedAt: 1,
      adminComments: 1,
      adminProgressionStatus: 1,
      adminPercentageProgressionStatus: 1,
      lastAdminUpdate: 1,
    };

    const dispositifs = await getDispositifsFromDB(neededFields);
    const adaptedDispositifs = adaptDispositifMainSponsorAndCreatorId(
      dispositifs
    );

    const array: string[] = [];

    array.forEach.call(adaptedDispositifs, (dispositif: IDispositif) => {
      turnToLocalizedTitles(dispositif, "fr");
    });

    res.status(200).json({
      text: "Succès",
      data: adaptedDispositifs,
    });
  } catch (error) {
    logger.error("[getAllDispositifs] error while getting dispositifs", {
      error,
    });
    switch (error) {
      case 500:
        res.status(500).json({
          text: "Erreur interne",
        });
        break;
      case 404:
        res.status(404).json({
          text: "Pas de résultat",
        });
        break;
      default:
        res.status(500).json({
          text: "Erreur interne",
        });
    }
  }
};

interface QueryUpdate {
  dispositifId: ObjectId;
  status: string;
}
export const updateDispositifStatus = async (
  req: RequestFromClient<QueryUpdate>,
  res: Res
) => {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (!req.body || !req.body.query) {
      return res.status(400).json({ text: "Requête invalide" });
    }

    const { dispositifId, status } = req.body.query;
    logger.info("[updateDispositifStatus]", { dispositifId, status });
    let newDispositif;
    if (status === "Actif") {
      newDispositif = { status, publishedAt: Date.now() };
    } else {
      newDispositif = { status };
    }
    await updateDispositifInDB(dispositifId, newDispositif);

    if (status === "Actif") {
      try {
        await updateLanguagesAvancement();
      } catch (error) {
        logger.info(
          "[updateDispositifStatus] error while updating languages avancement",
          { error }
        );
      }
    }
    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifStatus] error", { error: error.message });
    return res.status(500).json({ text: "Erreur interne" });
  }
};

interface QueryModify {
  dispositifId: ObjectId | null;
  sponsorId: ObjectId;
  status: string | null;
}

export const modifyDispositifMainSponsor = async (
  req: RequestFromClient<QueryModify>,
  res: Res
) => {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (
      !req.body ||
      !req.body.query ||
      !req.body.query.dispositifId ||
      !req.body.query.sponsorId ||
      !req.body.query.status
    ) {
      return res.status(400).json({ text: "Requête invalide" });
    }

    const { dispositifId, sponsorId, status } = req.body.query;
    logger.info("[modifyDispositifMainSponsor]", {
      dispositifId,
      sponsorId,
      status,
    });

    const modifiedDispositif = {
      mainSponsor: sponsorId,
      status: status === "En attente non prioritaire" ? "En attente" : status,
    };
    await updateDispositifInDB(dispositifId, modifiedDispositif);

    await updateAssociatedDispositifsInStructure(dispositifId, sponsorId);

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[modifyDispositifMainSponsor] error", {
      error: error.message,
    });
    return res.status(500).json({ text: "Erreur interne" });
  }
};

interface QueryModifyAdmin {
  dispositifId: ObjectId;
  adminComments: string;
  adminProgressionStatus: string;
  adminPercentageProgressionStatus: string;
}
export const updateDispositifAdminComments = async (
  req: RequestFromClient<QueryModifyAdmin>,
  res: Res
) => {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (!req.body || !req.body.query || !req.body.query.dispositifId) {
      return res.status(400).json({ text: "Requête invalide" });
    }

    const {
      dispositifId,
      adminComments,
      adminProgressionStatus,
      adminPercentageProgressionStatus,
    } = req.body.query;

    logger.info("[updateDispositifAdminComments] data", {
      dispositifId,
      adminComments,
      adminProgressionStatus,
      adminPercentageProgressionStatus,
    });

    const modifiedDispositif = {
      adminComments,
      adminProgressionStatus,
      adminPercentageProgressionStatus,
      lastAdminUpdate: Date.now(),
    };

    await updateDispositifInDB(dispositifId, modifiedDispositif);

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifAdminComments] error", {
      error: error.message,
    });
    return res.status(500).json({ text: "Erreur interne" });
  }
};

export const getNbDispositifsByRegion = async (req: {}, res: Res) => {
  try {
    logger.info("[getNbDispositifsByRegion]");
    const neededFields = { contenu: 1 };
    const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(
      neededFields
    );

    const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
    const dispositifsWithoutGeoloc = adaptedDispositifs
      .filter((dispositif) => dispositif.department === "No geoloc")
      .map((dispo) => dispo._id);
    const regionFigures = getRegionFigures(adaptedDispositifs);
    return res
      .status(200)
      .json({ text: "OK", data: { regionFigures, dispositifsWithoutGeoloc } });
  } catch (error) {
    logger.error("[getNbDispositifsByRegion] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
