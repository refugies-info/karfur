
import { celebrate, Joi, Segments } from "celebrate";

/**
 * Request validator
 */
export const getValidator = (type: "post" | "patch") => {
  const baseValidator: any = {
    [Segments.BODY]: Joi.object({
      name: Joi.object({
        fr: Joi.string(),
      }).or("fr").unknown(), // at least fr required
      short: Joi.object({
        fr: Joi.string(),
      }).or("fr").unknown(),
      colors: Joi.object({
        color100: Joi.string(),
        color80: Joi.string(),
        color60: Joi.string(),
        color40: Joi.string(),
        color30: Joi.string(),
      }),
      position: Joi.number(),
      icon: Joi.any(), // TODO: update type here
      banner: Joi.any(),
      appImage: Joi.any(),
      shareImage: Joi.any(),
      notificationEmoji: Joi.string(),
    })
  };

  if (type === "patch") {
    baseValidator[Segments.PARAMS] = Joi.object({
      id: Joi.string()
    })
  }

  return celebrate(baseValidator);
}

export interface Request {
  name: {
    fr: string;
    [key: string]: string;
  };
  short: {
    fr: string;
    [key: string]: string;
  };
  colors: {
    color100: string;
    color80: string;
    color60: string;
    color40: string;
    color30: string;
  }
  position: number;
  icon: Object;
  banner: Object;
  appImage: Object;
  shareImage: Object;
  notificationEmoji: string;
}
