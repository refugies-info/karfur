import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import logger from "../../../logger";

import { getNotificationsForUser } from "../../../modules/notifications/notifications.service";

const validator = celebrate({
  [Segments.HEADERS]: Joi.object({
    "x-app-uid": Joi.string()
      .required()
      .regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  }).unknown()
});

const handler = async (req: Request, res: Response) => {
  logger.info("[getNotifications] received");
  const uid = req.headers["x-app-uid"];

  const notifications = await getNotificationsForUser(uid as string);
  const unseenCount = notifications.filter((notif) => !notif.seen).length;

  res.status(200).json({
    unseenCount,
    notifications
  });
};

export default [validator, handler];
