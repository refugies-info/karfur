import { getNeedsFromDB } from "./needs.repository";
import logger from "../../logger";
import { ObjectId } from "mongoose";

export const computePossibleNeeds = async (
  actualNeeds: ObjectId[],
  contentTags: any[]
) => {
  try {
    const allNeeds = await getNeedsFromDB();

    const newNeeds = actualNeeds.filter((needId) => {
      const correspondingNeedArray = allNeeds.filter(
        (need) => need._id.toString() === needId.toString()
      );
      const correspondingNeedTheme =
        correspondingNeedArray.length > 0
          ? correspondingNeedArray[0].tagName
          : null;
      if (!correspondingNeedTheme) return false;
      let isNeedInTags = false;
      if (contentTags) {
        // @ts-ignore
        contentTags.forEach((tag) => {
          if (tag && tag.name === correspondingNeedTheme) {
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
