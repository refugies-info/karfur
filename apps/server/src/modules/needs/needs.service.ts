import logger from "~/logger";
import { getNeedsFromDB } from "./needs.repository";

export const computePossibleNeeds = async (actualNeeds: string[], contentThemes: string[]) => {
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
    logger.error("[computePossibleNeeds] error while getting needs", {
      error: error.message,
    });
  }
};
