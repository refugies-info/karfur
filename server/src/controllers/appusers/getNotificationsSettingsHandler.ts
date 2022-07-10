import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";

import logger from "src/logger";

import { getNotificationsSettings } from "src/modules/appusers/appusers.service";

const validator = celebrate({
  [Segments.HEADERS]: Joi.object({
    "x-app-uid": Joi.string()
      .required()
      .regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  }).unknown()
});

const handler = async (req: Request, res: Response) => {
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
    logger.error(`updateNotificationsSettingsHandler error: ${err}`);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

export default [validator, handler];
