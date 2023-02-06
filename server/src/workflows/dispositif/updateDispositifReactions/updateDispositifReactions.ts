import { Moment } from "moment";
import uniqid from "uniqid";
import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import {
  updateDispositifInDB,
  modifyReadSuggestionInDispositif,
  getDispositifById
} from "../../../modules/dispositif/dispositif.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { log } from "./log";
import { DispositifId } from "src/typegoose";

interface Request {
  dispositifId: DispositifId;
  fieldName: "suggestions" | "merci";
  keyValue?: number;
  subkey?: number;
  suggestion?: string;
  createdAt?: Moment;
  read?: boolean;
  type: "remove" | "add" | "read";
  suggestionId?: string;
}

export const updateDispositifReactions = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    if (!req.body || !req.body.dispositifId || !req.body.fieldName) {
      throw new Error("INVALID_REQUEST");
    }
    logger.info("[updateDispositifReactions] received", { body: req.body });
    let { dispositifId, fieldName, suggestionId, type, ...suggestion } = req.body;

    if (type !== "remove" && type !== "add" && type !== "read") {
      throw new Error("INCORRECT_TYPE");
    }
    const dispositif = await getDispositifById(dispositifId, { mainSponsor: 1 });
    await log(dispositif, dispositifId);

    if (type === "remove") {
      await updateDispositifInDB(dispositifId, {
        $pull: { [fieldName]: { suggestionId } }
      });
      return res.status(200).json({
        text: "Succès"
      });
    }

    if (type === "read") {
      await modifyReadSuggestionInDispositif(dispositifId, suggestionId);
      return res.status(200).json({
        text: "Succès"
      });
    }

    // FIXME pas de code mongo dans le code métier
    if (type === "add") {
      const update = {
        $push: {
          [fieldName]: {
            ...(req.userId && { userId: req.userId }),
            ...(req.user && {
              username: req.user.username,
              picture: req.user.picture
            }),
            ...suggestion,
            createdAt: new Date(),
            suggestionId: uniqid("feedback_")
          }
        }
      };
      await updateDispositifInDB(dispositifId, update);
      return res.status(200).json({
        text: "Succès"
      });
    }
  } catch (error) {
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "INCORRECT_TYPE":
        return res.status(400).json({ text: "Type invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
