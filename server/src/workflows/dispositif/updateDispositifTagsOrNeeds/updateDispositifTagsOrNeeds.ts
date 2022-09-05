import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import {
  updateDispositifInDB,
  getDispositifById,
} from "../../../modules/dispositif/dispositif.repository";
import { computePossibleNeeds } from "../../../modules/needs/needs.service";
import {
  checkRequestIsFromSite,
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";
import { log } from "./log";

interface QueryUpdate {
  dispositifId: ObjectId;
  theme?: ObjectId;
  secondaryThemes?: ObjectId[];
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
    const { dispositifId, theme, secondaryThemes, needs } = req.body.query;
    logger.info("[updateDispositifTagsOrNeeds]", { dispositifId, theme, secondaryThemes });

    // @ts-ignore
    checkIfUserIsAdmin(req.user.roles);
    const allThemes: ObjectId[] = [];
    if (theme) allThemes.push(theme);
    if (secondaryThemes?.length) allThemes.push(...secondaryThemes);

    let newNeeds: ObjectId[] = [];
    if (theme || secondaryThemes) {
      const originalDispositif = await getDispositifById(dispositifId, {
        needs: 1,
      });
      if (needs || originalDispositif.needs) {
        // if a need of the content has a tag that is not a tag of the content we remove the need
        newNeeds = await computePossibleNeeds(needs || originalDispositif.needs, allThemes);
      }
    }

    const newDispositif = theme ? { theme, secondaryThemes, needs: newNeeds } : { needs };

    // @ts-ignore
    const isAdmin = req.user.roles.find((x: any) => x.nom === "Admin");
    if ((theme || secondaryThemes) && isAdmin) {
      // @ts-ignore
      newDispositif.themesSelectedByAuthor = false;
    }

    await log(dispositifId, allThemes.length > 0, req.user._id)

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
