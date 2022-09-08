
import { celebrate, Joi, Segments } from "celebrate";
import { LangueDoc } from "../../schema/schemaLangue";
import { ThemeDoc } from "../../schema/schemaTheme";

export const isThemeActive = (theme: ThemeDoc, activeLanguages: LangueDoc[]) => {
  // titles
  for (const ln of activeLanguages) {
    if (!theme.name[ln.i18nCode] || !theme.short[ln.i18nCode]) return false
  }

  if (
    // colors
    !theme.colors.color100 ||
    !theme.colors.color80 ||
    !theme.colors.color60 ||
    !theme.colors.color40 ||
    !theme.colors.color30 ||

    // images
    !theme.icon.secure_url ||
    !theme.banner.secure_url ||
    !theme.appImage.secure_url ||
    !theme.shareImage.secure_url ||

    !theme.notificationEmoji
  ) return false;
  return true;
}

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
      icon: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string().allow(""),
        imgId: Joi.string().allow(""),
      }),
      banner: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string().allow(""),
        imgId: Joi.string().allow(""),
      }),
      appBanner: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string().allow(""),
        imgId: Joi.string().allow(""),
      }),
      appImage: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string().allow(""),
        imgId: Joi.string().allow(""),
      }),
      shareImage: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string().allow(""),
        imgId: Joi.string().allow(""),
      }),
      notificationEmoji: Joi.string(),

      ...(type === "patch" ? {
        adminComments: Joi.string()
      } : {})
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
  icon: {
    secure_url: string;
    public_id: string;
    imgId: string;
  };
  banner: {
    secure_url: string;
    public_id: string;
    imgId: string;
  };
  appBanner: {
    secure_url: string;
    public_id: string;
    imgId: string;
  };
  appImage: {
    secure_url: string;
    public_id: string;
    imgId: string;
  };
  shareImage: {
    secure_url: string;
    public_id: string;
    imgId: string;
  };
  notificationEmoji: string;
  adminComments?: string;
}
