import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import {
  updateDispositifInDB,
  getDispositifById,
} from "../../../modules/dispositif/dispositif.repository";
import {
  checkRequestIsFromSite,
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";
import { computePossibleNeeds } from "../../../modules/needs/needs.service";
import { addOrUpdateDispositifInContenusAirtable } from "src/controllers/miscellaneous/airtable";
import { DispositifDoc } from "src/schema/schemaDispositif";

interface QueryUpdate {
  dispositifId: ObjectId;
  titreInformatif?: string;
  titreMarque?: string;
  typeContenu?: string;
  status?: string;
  tags?: Object[];
  needs?: ObjectId[];
}
export const updateDispositifTagsOrNeeds = async (
  req: RequestFromClient<QueryUpdate>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.body || !req.body.query) {
      throw new Error("INVALID_REQUEST");
    }
    const {
      dispositifId,
      tags,
      needs,
      titreInformatif,
      titreMarque,
      typeContenu,
      status,
    } = req.body.query;
    logger.info("[updateDispositifTagsOrNeeds]", { dispositifId, tags });

    // @ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    let newNeeds: ObjectId[] = [];
    let originalDispositif: DispositifDoc;
    if (tags) {
      originalDispositif = await getDispositifById(dispositifId, {
        needs: 1,
      });
      if (originalDispositif.needs) {
        // if a need of the content has a tag that is not a tag of the content we remove the need
        newNeeds = await computePossibleNeeds(originalDispositif.needs, tags);
      }
    }

    const newDispositif = tags ? { tags, needs: newNeeds } : { needs };

    if (status === "Actif") {
      logger.info("[addDispositif] dispositif is Actif", {
        dispositifId: dispositifId,
      });
      try {
        await addOrUpdateDispositifInContenusAirtable(
          titreInformatif,
          titreMarque,
          dispositifId,
          newDispositif.tags,
          typeContenu,
          null,
          false
        );
      } catch (error) {
        logger.error(
          "[addDispositif] error while updating contenu in airtable",
          { error: error.message }
        );
      }
    }
    await updateDispositifInDB(dispositifId, newDispositif);
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositifTagsOrNeeds] error", {
      error: error.message,
    });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(404).json({ text: "Non authorisé" });

      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
