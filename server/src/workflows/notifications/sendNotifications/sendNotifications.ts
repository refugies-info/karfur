import { celebrate, Joi, Segments } from "celebrate";
import { Response } from "express";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { log } from "./log";

import { sendNotificationsForDemarche } from "../../../modules/notifications/notifications.service";
import { RequestFromClientWithBody } from "../../../types/interface";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    demarcheId: Joi.string().required()
  })
});

interface Request {
  demarcheId: ObjectId;
}

const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Response
) => {
  try {
    logger.info("[sendNotifications] received");
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);
    const { demarcheId } = req.body;

    await sendNotificationsForDemarche(demarcheId);
    await log(demarcheId, req.userId);

    res.status(200).json({
      status: "Succès"
    });
  } catch (e) {
    logger.error("[sendNotifications] error", { error: e.message });
    switch (e.message) {
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Lecture interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }

};

export default [validator, handler];