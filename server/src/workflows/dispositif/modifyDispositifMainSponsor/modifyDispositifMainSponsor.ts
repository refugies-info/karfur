import logger from "../../../logger";
import { RequestFromClient, Res } from "../../../types/interface";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { log } from "./log";
import { Dispositif, DispositifId, StructureId } from "src/typegoose";

interface QueryModify {
  dispositifId: DispositifId | null;
  sponsorId: StructureId;
  status: Dispositif["status"] | null;
}

export const modifyDispositifMainSponsor = async (req: RequestFromClient<QueryModify>, res: Res) => {
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

    checkIfUserIsAdmin(req.user);

    const { dispositifId, sponsorId, status } = req.body.query;
    logger.info("[modifyDispositifMainSponsor]", {
      dispositifId,
      sponsorId,
      status
    });

    const modifiedDispositif = {
      mainSponsor: sponsorId,
      status: status === "En attente non prioritaire" ? "En attente" : status
    };
    const oldDispositif = await getDispositifById(dispositifId, { mainSponsor: 1 });
    await updateDispositifInDB(dispositifId, modifiedDispositif);

    await updateAssociatedDispositifsInStructure(dispositifId, sponsorId);

    await log(oldDispositif, dispositifId, sponsorId, req.user._id);

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[modifyDispositifMainSponsor] error", {
      error: error.message
    });
    return res.status(500).json({ text: "Erreur interne" });
  }
};
