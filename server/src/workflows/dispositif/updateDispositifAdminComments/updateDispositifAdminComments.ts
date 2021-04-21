import { RequestFromClient, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";

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
