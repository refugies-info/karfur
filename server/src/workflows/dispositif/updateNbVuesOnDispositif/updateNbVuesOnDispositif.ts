import { RequestFromClient, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";

interface Query {
  id: ObjectId;
  nbVues: number;
}

export const updateNbVuesOnDispositif = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    const { id, nbVues } = req.body.query;
    logger.info(
      `[updateNbVuesOnDispositif] received for dispositif with id ${id} and nbVues ${nbVues}`
    );
    await updateDispositifInDB(id, { nbVues });

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateNbVuesOnDispositif] error", { error: error.message });
    res.status(500).json({ text: "KO" });
  }
};
