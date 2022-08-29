import { getNeedsFromDB } from "./needs.repository";
import logger from "../../logger";
import { ObjectId } from "mongoose";

export const computePossibleNeeds = async (
  actualNeeds: ObjectId[],
  contentThemes: ObjectId[]
) => {
  try {
    const allNeeds = await getNeedsFromDB();

    const newNeeds = actualNeeds.filter((needId) => {
      const need = allNeeds.find((n) => n._id.toString() === needId.toString());
      const correspondingNeedTheme = need?.theme || null;
      if (!correspondingNeedTheme) return false;
      let isNeedInTags = false;
      if (contentThemes) {
        contentThemes.forEach((themeId) => {
          if (themeId.toString() === correspondingNeedTheme._id.toString()) {
            isNeedInTags = true;
            return;
          }
        });
        if (isNeedInTags) return true;
        return false;
      }
    });
    return newNeeds;
  } catch (error) {
    logger.error("[addDispositif] error while updating needs", {
      error: error.message,
    });
  }
};


import { celebrate, Joi, Segments } from "celebrate";
import { Picture } from "src/types/interface";

/**
 * Request validator
 */
export const getValidator = (type: "post" | "patch") => {
  const baseValidator: any = {
    [Segments.BODY]: Joi.object({
      fr: Joi.object({
        text: Joi.string(),
        subtitle: Joi.string()
      }),
      theme: Joi.string(),
      image: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string(),
        imgId: Joi.string(),
      }).allow(null),

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
  fr: {
    text: string;
    subtitle: string
  };
  theme: ObjectId;
  image: Picture;
  adminComments?: string;
}

