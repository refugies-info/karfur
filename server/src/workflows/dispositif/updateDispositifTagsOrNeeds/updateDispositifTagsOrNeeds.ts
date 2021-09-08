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

interface QueryUpdate {
  dispositifId: ObjectId;
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

    const { dispositifId, tags, needs } = req.body.query;
    logger.info("[updateDispositifTagsOrNeeds]", { dispositifId, tags });

    // @ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    let newNeeds: ObjectId[] = [];
    if (tags) {
      const originalDispositif = await getDispositifById(dispositifId, {
        needs: 1,
      });

      if (originalDispositif.needs) {
        // if a need of the content has a tag that is not a tag of the content we remove the need
        newNeeds = await computePossibleNeeds(originalDispositif.needs, tags);
      }
    }

    const newDispositif = tags ? { tags, needs: newNeeds } : { needs };

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
