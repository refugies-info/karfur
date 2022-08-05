import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";
import logger from "../../../logger";

import { updateOrCreateAppUser } from "../../../modules/appusers/appusers.repository";

const validator = celebrate({
  [Segments.HEADERS]: Joi.object({
    "x-app-uid": Joi.string()
      .required()
      .regex(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  }).unknown(),
  [Segments.BODY]: Joi.object().keys({
    city: Joi.string().allow(null),
    department: Joi.string().allow(null),
    selectedLanguage: Joi.string().allow(null),
    age: Joi.string().allow(null),
    frenchLevel: Joi.string().allow(null),
    expoPushToken: Joi.string().allow(null)
  })
});

const handler = async (req: Request, res: Response) => {
  logger.info("[updateAppUser] received");

  const uid = req.headers["x-app-uid"];
  const updated = await updateOrCreateAppUser({
    ...req.body,
    uid
  });

  res.status(200).json({
    updated
  });
};

export default [validator, handler];
