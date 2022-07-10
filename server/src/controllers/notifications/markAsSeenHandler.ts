import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";

import { markNotificationAsSeen } from "src/modules/notifications/notifications.service";

const validator = celebrate({
  [Segments.HEADERS]: Joi.object({
    "x-app-uid": Joi.string()
      .required()
      .regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  }).unknown(),
  [Segments.BODY]: Joi.object({
    notificationId: Joi.string().required()
  })
});

const handler = async (req: Request, res: Response) => {
  const uid = req.headers["x-app-uid"];
  const { notificationId } = req.body;

  const success = await markNotificationAsSeen(notificationId, uid as string);

  res.status(200).json({
    error: !success
  });
};

export default [validator, handler];
