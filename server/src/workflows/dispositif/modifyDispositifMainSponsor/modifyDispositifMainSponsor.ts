import { ObjectId } from "mongoose";
import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";

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
