import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { findLogs } from "../../../modules/logs/logs.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

export interface Request {
  id: ObjectId;
}

export const getLogs = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[getLogs] received with id", req?.body?.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles)

    if (!req.body.id) throw new Error("INVALID_REQUEST");

    const logs = await findLogs(req.body.id);
    return res.status(200).json({
      text: "Succès",
      data: logs,
    });
  } catch (error) {
    logger.error("[getLogs] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Lecture interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
