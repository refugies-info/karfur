import { celebrate, Joi, Segments } from "celebrate";
import { Response } from "express";
import logger from "../../../logger";
import { log } from "./log";

import { sendNotificationsForDemarche } from "../../../modules/notifications/notifications.service";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { DispositifId } from "src/typegoose";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    demarcheId: Joi.string().required()
  })
});

interface Request {
  demarcheId: DispositifId;
}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[sendNotifications] received");
    checkIfUserIsAdmin(req.user);
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
