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
