import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response } from "express";

import { AppUserType } from "../../schema/schemaAppUser";
import { updateAppUser } from "../../workflows/appusers/updateAppUser";

const validator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    uid: Joi.string().required(),
    city: Joi.string().allow(null),
    department: Joi.string().allow(null),
    selectedLanguage: Joi.string().allow(null),
    age: Joi.string().allow(null),
    frenchLevel: Joi.string().allow(null),
    expoPushToken: Joi.string().allow(null)
  })
});

const handler = async (req: Request, res: Response) => {
  const payload: AppUserType = req.body;
  const updated = await updateAppUser(payload);

  res.status(200).json({
    updated
  });
};

export default [validator, handler];
