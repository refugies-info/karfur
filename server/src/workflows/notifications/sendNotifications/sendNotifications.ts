import { celebrate, Joi, Segments } from "celebrate";
import { Response } from "express";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { log } from "./log";

import { sendNotificationsForDemarche } from "../../../modules/notifications/notifications.service";
import { RequestFromClientWithBody } from "src/types/interface";
import { checkIfUserIsAdmin } from "src/libs/checkAuthorizations";

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
    logger.error("[sendNotifications] error", e);

    res.status(500).json({
      status: "Erreur"
    });
  }

};

export default [validator, handler];
