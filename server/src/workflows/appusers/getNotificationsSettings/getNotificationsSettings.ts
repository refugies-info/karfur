import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";

import logger from "../../../logger";

import { getNotificationsSettings } from "../../../modules/appusers/appusers.repository";

const validator = celebrate({
  [Segments.HEADERS]: Joi.object({
    "x-app-uid": Joi.string()
      .required()
      .regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  }).unknown()
});

const handler = async (req: Request, res: Response) => {
  logger.info("[getNotificationsSettings] received");
  const uid = req.headers["x-app-uid"];

  try {
    const settings = await getNotificationsSettings(uid as string);
    if (!settings) {
      return res.status(404).json({
        error: "Settings not found"
      });
    }
    res.status(200).json(settings);
  } catch (err) {
    logger.error("[getNotificationsSettings] error", err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

export default [validator, handler];
